/**
 * Interface do Repositório de Lembrete
 * Define o contrato para persistência de lembretes
 */
import { Reminder } from '../../entities/reminder.entity';

export interface ReminderRepository {
  /**
   * Cria um novo lembrete
   */
  create(reminder: Reminder): Promise<Reminder>;

  /**
   * Busca um lembrete por ID
   */
  findById(id: string): Promise<Reminder | null>;

  /**
   * Busca todos os lembretes de um usuário
   */
  findByUserId(userId: string): Promise<Reminder[]>;

  /**
   * Busca lembretes de um usuário por data
   */
  findByUserIdAndDate(
    userId: string,
    date: Date,
  ): Promise<Reminder[]>;

  /**
   * Atualiza um lembrete existente
   */
  update(reminder: Reminder): Promise<Reminder>;

  /**
   * Remove um lembrete
   */
  delete(id: string): Promise<void>;
}

