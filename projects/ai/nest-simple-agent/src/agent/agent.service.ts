import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  createOpenAIClient,
  createTextResponse,
  readOpenAIConfig,
} from '@workspace/node-sdk';
import { ChatDto } from './dto/chat.dto';

export interface AgentReply {
  role: 'assistant';
  model: string;
  responseId: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class AgentService {
  private readonly client: ReturnType<typeof createOpenAIClient>;
  private readonly model: string;

  constructor() {
    const config = readOpenAIConfig(process.env);
    this.client = createOpenAIClient(config);
    this.model = config.model;
  }

  async reply(input: ChatDto): Promise<AgentReply> {
    if (!this.client) {
      throw new ServiceUnavailableException('OPENAI_API_KEY is missing');
    }

    const trimmedMessage = input.message.trim();
    const systemPrompt =
      input.systemPrompt?.trim() ||
      'You are a concise and helpful AI assistant inside a NestJS demo agent.';

    try {
      const response = await createTextResponse({
        client: this.client,
        model: this.model,
        instructions: systemPrompt,
        input: trimmedMessage,
        user: input.userId,
      });

      return {
        role: 'assistant',
        model: response.model,
        responseId: response.id,
        message: response.output_text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown OpenAI error';

      throw new ServiceUnavailableException(
        `OpenAI request failed: ${message}`,
      );
    }
  }
}
