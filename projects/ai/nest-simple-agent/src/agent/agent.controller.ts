import { Body, Controller, Post } from '@nestjs/common';
import { AgentReply, AgentService } from './agent.service';
import { ChatDto } from './dto/chat.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  chat(@Body() input: ChatDto): Promise<AgentReply> {
    return this.agentService.reply(input);
  }
}
