/**
 * Serviço de Heurística para Detecção de Datas
 * Fallback quando a IA não consegue detectar datas/horas
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateHeuristicService {
  /**
   * Detecta data/hora em texto em português
   * Retorna Date calculado ou null se não detectar
   */
  detectDateTime(text: string): Date | null {
    const normalized = text.toLowerCase().trim();

    // Tentar detectar padrões de data/hora
    const dateTime = this.detectDate(normalized);
    if (!dateTime) {
      return null;
    }

    const time = this.detectTime(normalized);
    if (time) {
      dateTime.setHours(time.hours, time.minutes, 0, 0);
    } else {
      // Se não detectar hora, usar 9h como padrão
      dateTime.setHours(9, 0, 0, 0);
    }

    // Se a data detectada for no passado, assumir próximo mês/ano
    const now = new Date();
    if (dateTime < now) {
      // Se for apenas dia do mês, tentar próximo mês
      if (this.isOnlyDayOfMonth(normalized)) {
        dateTime.setMonth(dateTime.getMonth() + 1);
        // Se ainda estiver no passado, próximo ano
        if (dateTime < now) {
          dateTime.setFullYear(dateTime.getFullYear() + 1);
        }
      } else {
        // Para "hoje", "amanhã", etc, não ajustar
        return null;
      }
    }

    return dateTime;
  }

  /**
   * Detecta data relativa ou absoluta
   */
  private detectDate(text: string): Date | null {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // "hoje"
    if (text.includes('hoje')) {
      return new Date(today);
    }

    // "amanhã"
    if (text.includes('amanhã') || text.includes('amanha')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    // "depois de amanhã"
    if (text.includes('depois de amanhã') || text.includes('depois de amanha')) {
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);
      return dayAfter;
    }

    // "dia X" (dia do mês)
    const dayMatch = text.match(/dia\s+(\d{1,2})/);
    if (dayMatch) {
      const day = parseInt(dayMatch[1], 10);
      if (day >= 1 && day <= 31) {
        const date = new Date(today);
        date.setDate(day);
        // Se o dia já passou este mês, assumir próximo mês
        if (date < today) {
          date.setMonth(date.getMonth() + 1);
        }
        return date;
      }
    }

    // "dia X de [mês]" (opcional, mais complexo)
    const monthNames = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];

    for (let i = 0; i < monthNames.length; i++) {
      const monthPattern = new RegExp(`dia\\s+(\\d{1,2})\\s+de\\s+${monthNames[i]}`, 'i');
      const match = text.match(monthPattern);
      if (match) {
        const day = parseInt(match[1], 10);
        if (day >= 1 && day <= 31) {
          const date = new Date(now.getFullYear(), i, day);
          // Se já passou este ano, próximo ano
          if (date < now) {
            date.setFullYear(date.getFullYear() + 1);
          }
          return date;
        }
      }
    }

    return null;
  }

  /**
   * Detecta hora no texto
   * Retorna { hours, minutes } ou null
   */
  private detectTime(text: string): { hours: number; minutes: number } | null {
    // Padrão "às Xh" ou "às X:XX"
    const timePatterns = [
      /às\s+(\d{1,2})h(?:\s+(\d{1,2}))?/i, // "às 9h" ou "às 9h 30"
      /às\s+(\d{1,2}):(\d{2})/i, // "às 9:30"
      /(\d{1,2})h(?:\s+(\d{1,2}))?/i, // "9h" ou "9h 30"
      /(\d{1,2}):(\d{2})/i, // "9:30"
    ];

    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return { hours, minutes };
        }
      }
    }

    return null;
  }

  /**
   * Verifica se o texto contém apenas dia do mês (sem mês específico)
   */
  private isOnlyDayOfMonth(text: string): boolean {
    return /dia\s+\d{1,2}/i.test(text) && !/dia\s+\d{1,2}\s+de/i.test(text);
  }
}


