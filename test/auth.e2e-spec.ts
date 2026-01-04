/**
 * Testes de integração para autenticação
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/api/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { ZodExceptionFilter } from '../src/api/filters/zod-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.refreshToken.deleteMany({});
    await prisma.aIInteraction.deleteMany({});
    await prisma.user.deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.aIInteraction.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user.name).toBe(registerDto.name);
    });

    it('deve falhar ao registrar com email duplicado', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Primeiro registro
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // Segundo registro com mesmo email
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('deve falhar ao registrar com email inválido', async () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('deve falhar ao registrar com senha muito curta', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'short',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Limpar dados antes de criar usuário
      await prisma.refreshToken.deleteMany({});
      await prisma.aIInteraction.deleteMany({});
      await prisma.user.deleteMany({});
      
      // Criar usuário para testes de login
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    });

    it('deve fazer login com sucesso', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginDto.email);
    });

    it('deve falhar ao fazer login com email incorreto', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('deve falhar ao fazer login com senha incorreta', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Limpar dados antes de criar usuário
      await prisma.refreshToken.deleteMany({});
      await prisma.aIInteraction.deleteMany({});
      await prisma.user.deleteMany({});
      
      // Criar usuário e obter refresh token
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      refreshToken = response.body.refreshToken;
    });

    it('deve renovar access token com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.refreshToken).not.toBe(refreshToken); // Deve ser rotacionado
    });

    it('deve falhar com refresh token inválido', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('deve falhar com refresh token expirado', async () => {
      // Criar um novo usuário e token para este teste específico
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'expired-test@example.com',
          password: 'password123',
        });
      const testRefreshToken = registerResponse.body.refreshToken;

      // Criar um token expirado manualmente no banco
      const expiredToken = await prisma.refreshToken.findFirst({
        where: { token: testRefreshToken },
      });
      if (expiredToken) {
        await prisma.refreshToken.update({
          where: { id: expiredToken.id },
          data: { expiresAt: new Date(Date.now() - 1000) },
        });
      }

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: testRefreshToken })
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      // Limpar dados antes de criar usuário
      await prisma.refreshToken.deleteMany({});
      await prisma.aIInteraction.deleteMany({});
      await prisma.user.deleteMany({});
      
      // Criar usuário e obter tokens
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('deve fazer logout com sucesso', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(204);

      // Verificar que o refresh token foi revogado
      const token = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      expect(token?.revokedAt).not.toBeNull();
    });

    it('deve falhar sem token de autenticação', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refreshToken })
        .expect(401);
    });
  });
});

