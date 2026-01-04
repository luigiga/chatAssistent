/**
 * Provider de IA Mockável
 * Implementa a interface AIProvider com lógica baseada em palavras-chave
 * Não integra com nenhum serviço real de IA
 */
import { Injectable } from '@nestjs/common';
import {
  AIProvider,
  AIInterpretationResponse,
} from '@domain/interfaces/ai-provider.interface';

@Injectable()
export class MockAIProvider implements AIProvider {
  /**
   * Interpreta uma mensagem em linguagem natural usando palavras-chave
   * Este é um mock simples que identifica padrões básicos
   */
  async interpret(userInput: string): Promise<AIInterpretationResponse> {
    const input = userInput.toLowerCase().trim();

    // Detectar recorrências primeiro (pode ser reminder recorrente)
    if (this.isRecurring(input)) {
      // Se tem padrão de recorrência, tratar como reminder
      if (/\btoda\s+(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)/i.test(input)) {
        return this.parseReminder(input);
      }
    }

    // Detectar tarefas
    if (this.isTask(input)) {
      return this.parseTask(input);
    }

    // Detectar lembretes
    if (this.isReminder(input)) {
      return this.parseReminder(input);
    }

    // Detectar notas
    if (this.isNote(input)) {
      return this.parseNote(input);
    }

    // Se não identificar nada, retorna unknown
    return {
      needs_confirmation: true,
      action_type: 'unknown',
      confirmation_message: 'Não consegui entender sua solicitação. Pode reformular?',
    };
  }

  /**
   * Verifica se o input é uma tarefa
   */
  private isTask(input: string): boolean {
    // Se contém "lembrar de" ou "lembrar", não é tarefa (é reminder)
    if (/\blembrar\s+de\b/i.test(input) || /\blembrar\b/i.test(input)) {
      return false;
    }
    
    const taskKeywords = [
      'tarefa',
      'task',
      'fazer',
      'completar',
      'finalizar',
      'preciso',
      'tenho que',
      'devo',
      'criar tarefa',
    ];
    return taskKeywords.some((keyword) => input.includes(keyword));
  }

  /**
   * Verifica se o input é um lembrete
   */
  private isReminder(input: string): boolean {
    // Detectar padrões de recorrência como reminder
    if (/\btoda\s+(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)/i.test(input)) {
      return true;
    }
    
    const reminderKeywords = [
      'lembrete',
      'reminder',
      'lembrar',
      'aviso',
      'alerta',
      'notificar',
      'me avise',
      'me lembre',
    ];
    return reminderKeywords.some((keyword) => input.includes(keyword));
  }

  /**
   * Verifica se o input é uma nota
   */
  private isNote(input: string): boolean {
    const noteKeywords = [
      'nota',
      'note',
      'anotar',
      'anotação',
      'escrever',
      'guardar',
      'salvar',
      'lembrar que',
    ];
    return noteKeywords.some((keyword) => input.includes(keyword));
  }

  /**
   * Extrai informações de uma tarefa do texto
   */
  private parseTask(input: string): AIInterpretationResponse {
    const title = this.extractTitle(input, ['tarefa', 'task', 'fazer', 'completar']);
    const description = this.extractDescription(input);
    const dueDate = this.extractDate(input);
    const priority = this.extractPriority(input);

    // Se não tem título claro, precisa de confirmação
    const needsConfirmation = !title || title.length < 3;

    return {
      needs_confirmation: needsConfirmation,
      action_type: 'task',
      task: {
        title: title || 'Nova Tarefa',
        description,
        due_date: dueDate,
        priority,
      },
      confirmation_message: needsConfirmation
        ? `Criar tarefa "${title || 'Nova Tarefa'}"?`
        : undefined,
    };
  }

  /**
   * Extrai informações de um lembrete do texto
   */
  private parseReminder(input: string): AIInterpretationResponse {
    const title = this.extractTitle(input, [
      'lembrete',
      'reminder',
      'lembrar',
      'aviso',
    ]);
    const description = this.extractDescription(input);
    const reminderDate = this.extractDate(input);
    const isRecurring = this.isRecurring(input);
    const recurrenceRule = isRecurring ? this.extractRecurrenceRule(input) : undefined;

    // Se é recorrente mas não tem horário, precisa de confirmação
    const needsConfirmation = isRecurring && !reminderDate;

    return {
      needs_confirmation: needsConfirmation,
      action_type: 'reminder',
      reminder: {
        title: title || 'Novo Lembrete',
        description,
        reminder_date: reminderDate || new Date().toISOString(),
        is_recurring: isRecurring,
        recurrence_rule: recurrenceRule,
      },
      confirmation_message: needsConfirmation
        ? `Criar lembrete "${title || 'Novo Lembrete'}"?`
        : undefined,
    };
  }

  /**
   * Extrai informações de uma nota do texto
   */
  private parseNote(input: string): AIInterpretationResponse {
    const title = this.extractTitle(input, ['nota', 'note', 'anotar']);
    const content = this.extractContent(input);

    const needsConfirmation = !content || content.length < 3;

    return {
      needs_confirmation: needsConfirmation,
      action_type: 'note',
      note: {
        title,
        content: content || input,
      },
      confirmation_message: needsConfirmation
        ? `Criar nota com o conteúdo fornecido?`
        : undefined,
    };
  }

  /**
   * Extrai título do texto
   */
  private extractTitle(input: string, keywords: string[]): string | undefined {
    // Remove palavras-chave comuns
    let title = input;
    keywords.forEach((keyword) => {
      title = title.replace(new RegExp(keyword, 'gi'), '');
    });

    // Remove palavras comuns
    const commonWords = ['de', 'a', 'o', 'em', 'para', 'com', 'por'];
    commonWords.forEach((word) => {
      title = title.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });

    // Remove datas e horários
    title = title.replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, '');
    title = title.replace(/\d{1,2}:\d{2}/g, '');

    title = title.trim();

    // Se o título for muito curto, retorna undefined
    if (title.length < 3) {
      return undefined;
    }

    // Capitaliza primeira letra
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  /**
   * Extrai descrição do texto
   */
  private extractDescription(input: string): string | undefined {
    // Procura por padrões como "descrição:", "sobre:", etc
    const descPatterns = [
      /descri[çc][ãa]o[:\s]+(.+)/i,
      /sobre[:\s]+(.+)/i,
      /detalhes?[:\s]+(.+)/i,
    ];

    for (const pattern of descPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  /**
   * Extrai conteúdo da nota
   */
  private extractContent(input: string): string {
    // Remove palavras-chave de nota
    let content = input
      .replace(/nota[:\s]+/gi, '')
      .replace(/note[:\s]+/gi, '')
      .replace(/anotar[:\s]+/gi, '')
      .trim();

    return content || input;
  }

  /**
   * Extrai data do texto
   */
  private extractDate(input: string): string | undefined {
    // Padrões de data específica: "dia 10", "dia 15", etc.
    const dayMatch = input.match(/\bdia\s+(\d{1,2})\b/i);
    if (dayMatch) {
      const day = parseInt(dayMatch[1], 10);
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth(), day);
      
      // Se o dia já passou neste mês, usar o próximo mês
      if (targetDate < now) {
        targetDate.setMonth(targetDate.getMonth() + 1);
      }
      
      // Definir horário padrão (09:00)
      targetDate.setHours(9, 0, 0, 0);
      return targetDate.toISOString();
    }
    
    // Padrões de data
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/, // DD/MM/YYYY
      /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /hoje/i,
      /amanh[ãa]/i,
      /depois de amanh[ãa]/i,
      /pr[óo]xima semana/i,
      /pr[óo]ximo m[êe]s/i,
    ];

    for (const pattern of datePatterns) {
      const match = input.match(pattern);
      if (match) {
        if (match[0].toLowerCase().includes('hoje')) {
          return new Date().toISOString();
        }
        if (match[0].toLowerCase().includes('amanhã')) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString();
        }
        if (match[0].toLowerCase().includes('depois de amanhã')) {
          const dayAfter = new Date();
          dayAfter.setDate(dayAfter.getDate() + 2);
          return dayAfter.toISOString();
        }
        // Para outros padrões, retorna a data atual + alguns dias
        return new Date().toISOString();
      }
    }

    return undefined;
  }

  /**
   * Extrai prioridade do texto
   */
  private extractPriority(input: string): 'low' | 'medium' | 'high' | undefined {
    if (/\b(alta|high|urgente|importante|prioridade)\b/i.test(input)) {
      return 'high';
    }
    if (/\b(baixa|low|baixo)\b/i.test(input)) {
      return 'low';
    }
    if (/\b(m[ée]dia|medium|normal)\b/i.test(input)) {
      return 'medium';
    }
    return undefined;
  }

  /**
   * Verifica se é recorrente
   */
  private isRecurring(input: string): boolean {
    // Detectar padrões como "toda segunda", "toda terça", etc.
    if (/\btoda\s+(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)/i.test(input)) {
      return true;
    }
    
    return /\b(di[áa]rio|daily|semanal|weekly|mensal|monthly|anual|yearly|recorrente|repetir)\b/i.test(
      input,
    );
  }

  /**
   * Extrai regra de recorrência
   */
  private extractRecurrenceRule(
    input: string,
  ): 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined {
    // Detectar dias da semana: "toda segunda", "toda terça", etc.
    if (/\btoda\s+(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)/i.test(input)) {
      return 'weekly';
    }
    
    if (/\b(di[áa]rio|daily)\b/i.test(input)) {
      return 'daily';
    }
    if (/\b(semanal|weekly)\b/i.test(input)) {
      return 'weekly';
    }
    if (/\b(mensal|monthly)\b/i.test(input)) {
      return 'monthly';
    }
    if (/\b(anual|yearly)\b/i.test(input)) {
      return 'yearly';
    }
    return undefined;
  }
}

