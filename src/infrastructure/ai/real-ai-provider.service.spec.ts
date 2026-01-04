/**
 * Testes unitários para RealAIProvider
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RealAIProvider } from './real-ai-provider.service';
import { validateAIResponse } from './ai-response.validator';

// Mock do fetch global
global.fetch = jest.fn();

describe('RealAIProvider', () => {
  let provider: RealAIProvider;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealAIProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const config: Record<string, string> = {
                AI_API_KEY: 'test-api-key',
                AI_API_URL: 'https://api.openai.com/v1/chat/completions',
                AI_MODEL: 'gpt-3.5-turbo',
                AI_MAX_TOKENS: '500',
                AI_TIMEOUT: '30000',
                AI_MAX_INPUT_LENGTH: '2000',
              };
              return config[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    provider = module.get<RealAIProvider>(RealAIProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('interpret', () => {
    it('deve interpretar texto e retornar resposta válida', async () => {
      const mockAIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: 'create_task',
                title: 'Comprar leite',
                description: null,
                dueDate: '2026-01-10T09:00:00Z',
                priority: 'high',
              }),
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAIResponse,
      });

      const result = await provider.interpret('Criar tarefa de comprar leite amanhã com prioridade alta');

      expect(result.action_type).toBe('task');
      expect(result.task?.title).toBe('Comprar leite');
      expect(result.task?.priority).toBe('high');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('deve retornar unknown se a IA retornar intent unknown', async () => {
      const mockAIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: 'unknown',
                title: null,
                description: null,
                dueDate: null,
                priority: null,
              }),
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAIResponse,
      });

      const result = await provider.interpret('texto sem sentido');

      expect(result.action_type).toBe('unknown');
      expect(result.needs_confirmation).toBe(true);
    });

    it('deve limitar tamanho do input', async () => {
      const longInput = 'a'.repeat(3000);
      const mockAIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: 'unknown',
                title: null,
                description: null,
                dueDate: null,
                priority: null,
              }),
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAIResponse,
      });

      await provider.interpret(longInput);

      // Verificar que o input foi limitado antes de ser enviado
      // O prompt completo será maior que 2000, mas o input do usuário dentro do prompt deve ser limitado
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;
      // O prompt contém o template + input do usuário
      // Verificar que o input do usuário (última parte após "TEXTO DO USUÁRIO:") foi limitado
      const userInputPart = userMessage.split('TEXTO DO USUÁRIO:')[1]?.split('RESPOSTA')[0]?.trim() || '';
      // O input do usuário deve ser limitado a 2000 caracteres
      // Pode ter alguns caracteres a mais devido a espaços, mas deve estar próximo de 2000
      expect(userInputPart.length).toBeLessThanOrEqual(2010);
    });

    it('deve retornar unknown em caso de erro na API', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await provider.interpret('teste');

      expect(result.action_type).toBe('unknown');
      expect(result.needs_confirmation).toBe(true);
      expect(result.confirmation_message).toContain('Erro ao processar');
    });

    it('deve retornar unknown se API retornar erro HTTP', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const result = await provider.interpret('teste');

      expect(result.action_type).toBe('unknown');
      expect(result.needs_confirmation).toBe(true);
    });

    it('deve lançar erro se AI_API_KEY não estiver configurada', async () => {
      const moduleWithoutKey = await Test.createTestingModule({
        providers: [
          RealAIProvider,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => undefined),
            },
          },
        ],
      }).compile();

      const providerWithoutKey = moduleWithoutKey.get<RealAIProvider>(RealAIProvider);

      await expect(providerWithoutKey.interpret('teste')).rejects.toThrow('AI_API_KEY não configurada');
    });
  });
});

describe('validateAIResponse', () => {
  it('deve validar resposta válida', () => {
    const validResponse = {
      intent: 'create_task',
      title: 'Tarefa',
      description: null,
      dueDate: '2026-01-10T09:00:00Z',
      priority: 'high',
    };

    expect(() => validateAIResponse(validResponse)).not.toThrow();
    const result = validateAIResponse(validResponse);
    expect(result.intent).toBe('create_task');
  });

  it('deve validar resposta com string JSON', () => {
    const jsonString = JSON.stringify({
      intent: 'create_task',
      title: 'Tarefa',
      description: null,
      dueDate: null,
      priority: null,
    });

    expect(() => validateAIResponse(jsonString)).not.toThrow();
  });

  it('deve remover markdown code blocks', () => {
    const jsonWithMarkdown = '```json\n{"intent":"create_task","title":"Tarefa","description":null,"dueDate":null,"priority":null}\n```';

    expect(() => validateAIResponse(jsonWithMarkdown)).not.toThrow();
  });

  it('deve lançar erro para resposta inválida', () => {
    const invalidResponse = {
      intent: 'invalid_intent',
      title: 'Tarefa',
    };

    expect(() => validateAIResponse(invalidResponse)).toThrow();
  });

  it('deve lançar erro para JSON inválido', () => {
    expect(() => validateAIResponse('invalid json')).toThrow();
  });
});

