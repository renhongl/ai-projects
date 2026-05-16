import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';

@Module({
  imports: [AgentModule],
  controllers: [AppController],
})
export class AppModule {}
