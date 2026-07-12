/**
 * 记忆机制模块
 * 实现论文中的短期记忆和长期记忆
 * 
 * TODO: 长期记忆需要调用 LLM 生成摘要，并在检索时使用向量搜索或 BM25
 * 当前实现为简化版，仅保留短期记忆
 */

/**
 * 更新短期记忆（保留最近 N 条消息）
 * @param {Array} messages - 所有消息
 * @param {number} windowSize - 窗口大小
 * @returns {Array} 短期记忆
 */
export function updateShortTermMemory(messages, windowSize = 10) {
  return messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-windowSize)
}

/**
 * 生成长期记忆摘要（基于滑动窗口）
 * @param {Array} messages - 对话历史
 * @param {Array} existingMemories - 现有长期记忆
 * @returns {Array} 更新后的长期记忆
 */
export function updateLongTermMemory(messages, existingMemories = []) {
  // 简化实现：每 5 轮对话生成一个摘要
  if (messages.length < 10) {
    return existingMemories
  }

  // 这里可以调用 LLM 生成摘要，暂时返回空
  // 实际实现时需要调用 LLM 来压缩对话历史
  return existingMemories
}

/**
 * 检索相关记忆
 * @param {string} query - 查询文本
 * @param {Array} longTermMemories - 长期记忆
 * @returns {Array} 相关记忆
 */
export function retrieveRelevantMemories(query, longTermMemories = []) {
  // 简化实现：返回所有记忆
  // 实际实现时应使用向量搜索或 BM25
  return longTermMemories
}
