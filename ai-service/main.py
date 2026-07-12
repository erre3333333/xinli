from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List

from config import AI_SERVICE_HOST, AI_SERVICE_PORT
from utils.openrouter_client import stream_chat
from utils.safety_checker import check_crisis, CRISIS_RESPONSE
from prompts.depression import SYSTEM_PROMPT as PROMPT_DEPRESSION
from prompts.anxiety import SYSTEM_PROMPT as PROMPT_ANXIETY
from prompts.ocd import SYSTEM_PROMPT as PROMPT_OCD
from prompts.bipolar import SYSTEM_PROMPT as PROMPT_BIPOLAR
from prompts.psychosis import SYSTEM_PROMPT as PROMPT_PSYCHOSIS
from prompts.ptsd import SYSTEM_PROMPT as PROMPT_PTSD
from prompts.eating import SYSTEM_PROMPT as PROMPT_EATING
from prompts.adhd import SYSTEM_PROMPT as PROMPT_ADHD
from prompts.assessment import SYSTEM_PROMPT as PROMPT_ASSESSMENT
from prompts.psychiatrist import SYSTEM_PROMPT as PROMPT_PSYCHIATRIST

app = FastAPI(title='MindGarden AI', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

PROMPTS = {
    'depression': PROMPT_DEPRESSION,
    'anxiety': PROMPT_ANXIETY,
    'ocd': PROMPT_OCD,
    'bipolar': PROMPT_BIPOLAR,
    'psychosis': PROMPT_PSYCHOSIS,
    'ptsd': PROMPT_PTSD,
    'eating': PROMPT_EATING,
    'adhd': PROMPT_ADHD,
}

class ChatRequest(BaseModel):
    message: str
    patient_type: str
    history: Optional[List[dict]] = []
    model: Optional[str] = None
    images: Optional[List[str]] = []

class AssessRequest(BaseModel):
    test_name: str
    test_subtitle: str
    patient_type: str
    total_score: int
    max_score: int
    severity: str
    severity_label: str
    condition_label: str
    answers: List[int]
    model: Optional[str] = None

class MedicationRequest(BaseModel):
    test_name: str
    test_subtitle: str
    patient_type: str
    total_score: int
    max_score: int
    severity: str
    severity_label: str
    condition_label: str
    answers: List[int]
    model: Optional[str] = None

@app.post('/ai/assess')
async def assess(request: AssessRequest):
    answers_detail = []
    for i, a in enumerate(request.answers):
        answers_detail.append(f'第{i + 1}题: {a}分')
    answers_str = '、'.join(answers_detail)

    user_message = f"""以下是心理测评结果，请基于此进行专业分析：

测评工具：{request.test_name}（{request.test_subtitle}）
评估对象：{request.condition_label}
总分：{request.total_score}/{request.max_score}
严重程度：{request.severity}（{request.severity_label}）
各题得分详情：{answers_str}

请按照专业格式撰写测评分析报告。"""

    messages = [
        {'role': 'system', 'content': PROMPT_ASSESSMENT},
        {'role': 'user', 'content': user_message},
    ]

    async def generate():
        try:
            async for token in stream_chat(messages, request.model):
                yield token
        except Exception as e:
            yield f'\n\n[AI 分析连接出错: {str(e)}。请重试或切换模型。]'

    return StreamingResponse(generate(), media_type='text/plain')

@app.post('/ai/medication')
async def medication(request: MedicationRequest):
    answers_detail = []
    for i, a in enumerate(request.answers):
        answers_detail.append(f'第{i + 1}题: {a}分')
    answers_str = '、'.join(answers_detail)

    user_message = f"""以下是一位患者的心理测评结果，请以精神科医生身份给出用药参考建议：

测评工具：{request.test_name}（{request.test_subtitle}）
诊断方向：{request.condition_label}
总分：{request.total_score}/{request.max_score}
严重程度：{request.severity}（{request.severity_label}）
各题得分：{answers_str}

请提供专业的用药参考建议。"""

    messages = [
        {'role': 'system', 'content': PROMPT_PSYCHIATRIST},
        {'role': 'user', 'content': user_message},
    ]

    async def generate():
        try:
            async for token in stream_chat(messages, request.model):
                yield token
        except Exception as e:
            yield f'\n\n[AI 精神科医生连接出错: {str(e)}。请重试或切换模型。]'

    return StreamingResponse(generate(), media_type='text/plain')

def _build_multimodal_content(text: str, images: List[str]):
    parts = [{'type': 'text', 'text': text or '请分析这张图片。'}]
    for img in images:
        parts.append({'type': 'image_url', 'image_url': {'url': img}})
    return parts

@app.post('/ai/chat')
async def chat(request: ChatRequest):
    system_prompt = PROMPTS.get(request.patient_type, PROMPT_DEPRESSION)

    crisis_detected = check_crisis(request.message)

    messages = [{'role': 'system', 'content': system_prompt}]
    for msg in request.history:
        messages.append({'role': msg['role'], 'content': msg['content']})

    if request.images:
        messages.append({'role': 'user', 'content': _build_multimodal_content(request.message, request.images)})
    else:
        messages.append({'role': 'user', 'content': request.message})

    async def generate():
        try:
            if crisis_detected:
                yield CRISIS_RESPONSE
                yield '\n\n---\n\n'
            async for token in stream_chat(messages, request.model):
                yield token
        except Exception as e:
            yield f'\n\n[连接出错: {str(e)}。请重试或切换模型。]'

    return StreamingResponse(generate(), media_type='text/plain')

@app.get('/ai/health')
async def health():
    return {'status': 'ok', 'service': 'MindGarden AI'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host=AI_SERVICE_HOST, port=AI_SERVICE_PORT, reload=True)
