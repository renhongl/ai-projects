import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      name: 'nest-simple-agent',
      status: 'ok',
      endpoints: ['GET /', 'POST /agent/chat'],
    };
  }
}
