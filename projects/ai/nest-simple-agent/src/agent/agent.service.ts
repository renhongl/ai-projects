import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import OpenAI from "openai";
import { ChatDto } from "./dto/chat.dto";

@Injectable()
export class AgentService {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    this.client = apiKey ? new OpenAI({ apiKey }) : null;
    this.model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  }

  async reply(input: ChatDto) {
    if (!this.client) {
      throw new ServiceUnavailableException("ServiceUnavailableException");
    }

    const trimmedMessage = input.message.trim();
    const systemPrompt =
      input.systemPrompt?.trim() ||
      "You are a concise and helpful AI assistant inside a NestJS demo agent.";

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: systemPrompt,
        input: trimmedMessage,
        user: input.userId,
      });

      return {
        role: "assistant",
        model: response.model,
        responseId: response.id,
        message: response.output_text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown OpenAI error";

      throw new ServiceUnavailableException(
        `OpenAI request failed: ${message}`,
      );
    }
  }
}
