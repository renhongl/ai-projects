import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

export interface TextResponseInput {
  client: OpenAI | null;
  model: string;
  instructions: string;
  input: string;
  user?: string;
}

export function readOpenAIConfig(env?: NodeJS.ProcessEnv): OpenAIConfig;
export function createOpenAIClient(config: OpenAIConfig): OpenAI | null;
export function createTextResponse(input: TextResponseInput): Promise<OpenAI.Responses.Response>;
