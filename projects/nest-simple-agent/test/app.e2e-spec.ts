import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AgentService } from '../src/agent/agent.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const agentServiceMock = {
    reply: jest.fn().mockResolvedValue({
      role: 'assistant',
      model: 'gpt-5-mini',
      responseId: 'resp_test',
      message: 'Hello from the mocked agent.',
      timestamp: '2026-04-15T00:00:00.000Z',
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AgentService)
      .useValue(agentServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns status', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
      });
  });

  it('POST /agent/chat returns a reply', async () => {
    await request(app.getHttpServer())
      .post('/agent/chat')
      .send({ message: 'hello agent' })
      .expect(201)
      .expect(({ body }) => {
        expect(agentServiceMock.reply).toHaveBeenCalled();
        expect(body.model).toBe('gpt-5-mini');
        expect(body.message).toContain('mocked agent');
      });
  });
});
