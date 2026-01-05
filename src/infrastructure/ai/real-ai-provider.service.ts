/**
 * Provider de IA Real
 * Implementa integração com API de IA (OpenAI, Anthropic, etc.)
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider, AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';
import { buildPrompt } from './prompt';
import { validateAIResponse } from './ai-response.validator';
import { mapAIResponseToDomain } from './ai-response.mapper';

interface AIConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  maxTokens: number;
  timeout: number;
  maxInputLength: number;
}

@Injectable()
export class RealAIProvider implements AIProvider {
  private readonly logger = new Logger(RealAIProvider.name);
  private readonly config: AIConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get<string>('AI_API_KEY') || '',
      apiUrl:
        this.configService.get<string>('AI_API_URL') ||
        'https://api.openai.com/v1/chat/completions',
      model: this.configService.get<string>('AI_MODEL') || 'gpt-3.5-turbo',
      maxTokens: parseInt(this.configService.get<string>('AI_MAX_TOKENS') || '500', 10),
      timeout: parseInt(this.configService.get<string>('AI_TIMEOUT') || '30000', 10),
      maxInputLength: parseInt(this.configService.get<string>('AI_MAX_INPUT_LENGTH') || '2000', 10),
    };

    if (!this.config.apiKey) {
      this.logger.warn('AI_API_KEY não configurada. O provider de IA real não funcionará.');
    }
  }

  async interpret(userInput: string): Promise<AIInterpretationResponse> {
    // Validar tamanho do input
    if (userInput.length > this.config.maxInputLength) {
      this.logger.warn(
        `Input muito longo: ${userInput.length} caracteres. Limitando para ${this.config.maxInputLength}.`,
      );
      userInput = userInput.slice(0, this.config.maxInputLength);
    }

    // Verificar se API key está configurada
    if (!this.config.apiKey) {
      throw new Error('AI_API_KEY não configurada. Configure a variável de ambiente AI_API_KEY.');
    }

    try {
      // Construir prompt
      const prompt = buildPrompt(userInput);

      // Log do prompt (sem dados sensíveis)
      this.logger.debug(
        `Chamando IA com modelo: ${this.config.model}, input length: ${userInput.length}`,
      );

      // Chamar API da IA
      const aiResponseRaw = await this.callAI(prompt);

      // Validar resposta
      const validatedResponse = validateAIResponse(aiResponseRaw);

      // Log da resposta (sem dados sensíveis)
      this.logger.debug(`IA respondeu com intent: ${validatedResponse.intent}`);

      // Mapear para formato do domínio
      return mapAIResponseToDomain(validatedResponse);
    } catch (error) {
      this.logger.error(
        `Erro ao chamar IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );

      // Em caso de erro, retornar unknown com confirmação
      return {
        needs_confirmation: true,
        action_type: 'unknown',
        confirmation_message: 'Erro ao processar sua solicitação. Pode tentar novamente?',
      };
    }
  }

  /**
   * Chama a API da IA
   * Suporta OpenAI e APIs compatíveis
   */
  private async callAI(prompt: string): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content:
                'Você é um assistente que retorna APENAS JSON válido, sem markdown, sem explicações.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: this.config.maxTokens,
          temperature: 0.3, // Baixa temperatura para respostas mais consistentes
          response_format: { type: 'json_object' }, // Forçar JSON (OpenAI)
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};

        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Se não conseguir parsear, usar texto como está
        }

        // Detectar erro de quota especificamente
        if (response.status === 429) {
          const errorCode = errorData?.error?.code || '';
          if (errorCode === 'insufficient_quota' || errorCode === 'rate_limit_exceeded') {
            throw new Error('QUOTA_EXCEEDED');
          }
        }

        throw new Error(`API da IA retornou erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Extrair conteúdo da resposta (formato OpenAI)
      if (data && typeof data === 'object' && 'choices' in data) {
        const choices = (data as { choices?: Array<{ message?: { content?: string } }> }).choices;
        if (choices && choices[0] && choices[0].message && choices[0].message.content) {
          const content = choices[0].message.content;
          return JSON.parse(content);
        }
      }

      // Se não for formato OpenAI, retornar data diretamente
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Timeout ao chamar IA (${this.config.timeout}ms)`);
        }
        throw error;
      }

      throw new Error('Erro desconhecido ao chamar IA');
    }
  }
}
