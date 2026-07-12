import { StateGraph, START, END } from '@langchain/langgraph'
import { GraphState } from './state.js'
import { psychiatristNode } from './nodes/psychiatrist.js'
import { psychologistNode } from './nodes/psychologist.js'
import { serviceAgentNode } from './nodes/serviceAgent.js'
import { recommendScaleNode, processScaleResultNode } from './nodes/scaleAgent.js'

const SERVICE_TYPES = ['child-emotion', 'adolescent', 'mindfulness', 'social-anxiety']

function isServiceType(agent) {
  return SERVICE_TYPES.includes(agent)
}

function routeAfterChat(state) {
  if (state.scaleRecommendation) return 'recommendScale'
  return END
}

const builder = new StateGraph(GraphState)
  .addNode('psychiatrist', psychiatristNode)
  .addNode('psychologist', psychologistNode)
  .addNode('serviceAgent', serviceAgentNode)
  .addNode('recommendScale', recommendScaleNode)
  .addNode('processScaleResult', processScaleResultNode)

// 根据 activeAgent 路由
builder.addConditionalEdges(START, (state) => {
  if (state.scaleResults?.length > 0 && state.scaleResults[state.scaleResults.length - 1]?.justSubmitted) {
    return 'processScaleResult'
  }
  if (isServiceType(state.activeAgent)) return 'serviceAgent'
  return state.activeAgent === 'psychologist' ? 'psychologist' : 'psychiatrist'
})

builder.addConditionalEdges('psychiatrist', routeAfterChat)
builder.addConditionalEdges('psychologist', routeAfterChat)
builder.addConditionalEdges('serviceAgent', routeAfterChat)
builder.addEdge('recommendScale', END)
builder.addConditionalEdges('processScaleResult', (state) => {
  if (isServiceType(state.activeAgent)) return 'serviceAgent'
  return state.activeAgent === 'psychologist' ? 'psychologist' : 'psychiatrist'
})

export const diagnosisGraph = builder.compile()
