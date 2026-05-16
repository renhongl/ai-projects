import OpenAI from 'openai';
import { getFirstDefined, toTrimmedString } from '@workspace/shared-utils';

export function readOpenAIConfig(env = process.env) {
  return {
    apiKey: toTrimmedString(getFirstDefined(env.OPENAI_API_KEY), ''),
    baseURL: toTrimmedString(getFirstDefined(env.OPENAI_BASE_URL), ''),
    model: toTrimmedString(getFirstDefined(env.OPENAI_MODEL), 'gpt-5-mini')
  };
}

export function createOpenAIClient(config) {
  if (!config.apiKey) {
    return null;
  }

  const options = { apiKey: config.apiKey };

  if (config.baseURL) {
    options.baseURL = config.baseURL;
  }

  return new OpenAI(options);
}

export async function createTextResponse({
  client,
  model,
  instructions,
  input,
  user
}) {
  if (!client) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  return client.responses.create({
    model,
    instructions,
    input,
    user
  });
}
