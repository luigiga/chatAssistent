/**
 * Testes de integração para interpretação de mensagens
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/api/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { ZodExceptionFilter } from '../src/api/filters/zod-exception.filter';

describe('InterpretController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ZodExceptionFilter());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Limpar dados antes de criar usuário
    await prisma.aIInteraction.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar usuário de teste e obter token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'interpret-test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    accessToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.aIInteraction.deleteMany({
      where: { userId },
    });
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      // Usuário pode já ter sido deletado
    }
    await app.close();
  });

  describe('POST /interpret', () => {
    it('deve interpretar uma tarefa com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'Criar tarefa de comprar leite amanhã com prioridade alta',
        })
        .expect(200);

      expect(response.body).toHaveProperty('interpretation');
      expect(response.body.interpretation.action_type).toBe('task');
      expect(response.body.interpretation.task).toBeDefined();
      expect(response.body.interpretation.task.title).toBeDefined();
      expect(response.body).toHaveProperty('interactionId');
      expect(response.body).toHaveProperty('executed');
    });

    it('deve interpretar uma nota com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'Anotar que preciso estudar TypeScript',
        })
        .expect(200);

      expect(response.body.interpretation.action_type).toBe('note');
      expect(response.body.interpretation.note).toBeDefined();
      expect(response.body.interpretation.note.content).toBeDefined();
    });

    it('deve interpretar um lembrete com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'Lembrete de reunião amanhã às 10h',
        })
        .expect(200);

      expect(response.body.interpretation.action_type).toBe('reminder');
      expect(response.body.interpretation.reminder).toBeDefined();
      expect(response.body.interpretation.reminder.title).toBeDefined();
    });

    it('deve retornar needs_confirmation quando não entender', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'asdfghjkl qwertyuiop',
        })
        .expect(200);

      expect(response.body.interpretation.action_type).toBe('unknown');
      expect(response.body.interpretation.needs_confirmation).toBe(true);
      expect(response.body.interpretation.confirmation_message).toBeDefined();
    });

    it('deve persistir a interação no banco', async () => {
      const text = 'Criar tarefa de teste';
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ text })
        .expect(200);

      const interaction = await prisma.aIInteraction.findUnique({
        where: { id: response.body.interactionId },
      });

      expect(interaction).toBeDefined();
      expect(interaction?.userInput).toBe(text);
      expect(interaction?.userId).toBe(userId);
    });

    it('deve falhar sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/interpret')
        .send({
          text: 'Criar tarefa',
        })
        .expect(401);
    });

    it('deve falhar com texto vazio', async () => {
      await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: '',
        })
        .expect(400);
    });

    it('deve extrair prioridade corretamente', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'Tarefa importante com prioridade alta',
        })
        .expect(200);

      expect(response.body.interpretation.task?.priority).toBe('high');
    });

    it('deve identificar recorrência em lembretes', async () => {
      const response = await request(app.getHttpServer())
        .post('/interpret')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          text: 'Lembrete diário de tomar água',
        })
        .expect(200);

      expect(response.body.interpretation.reminder?.is_recurring).toBe(true);
      expect(response.body.interpretation.reminder?.recurrence_rule).toBe(
        'daily',
      );
    });
  });
});

