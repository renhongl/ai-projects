import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ChatDto } from './dto/chat.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  chat(@Body() input: ChatDto) {
    return this.agentService.reply(input);
  }
}
