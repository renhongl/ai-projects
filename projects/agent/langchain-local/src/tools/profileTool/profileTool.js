import { DynamicTool } from '@langchain/core/tools';
import { createProfileKnowledgeBase } from './profileKnowledgeBase.js';

export const profileTool = new DynamicTool({
  name: 'search_my_profile',
  description:
    '当用户询问profile相关信息时使用，如果未查到内容，回答暂无相关信息。如果用户问题涉及人员相关，可以先使用该工具查询相关信息。',
  func: async (input) => {
    console.log(`\n[Tool 触发] 正在检索个人资料: "${input}"`);

    const knowledgeBase = await createProfileKnowledgeBase();
    const results = await knowledgeBase.search(input, 3);

    if (results.length === 0) {
      return '没有检索到相关的个人资料。';
    }

    return results.join('\n---\n');
  },
});
