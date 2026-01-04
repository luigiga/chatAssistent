/**
 * Barrel export para o domínio
 * Facilita imports em outras camadas
 */

// Entities
export * from './entities/user.entity';
export * from './entities/task.entity';
export * from './entities/note.entity';
export * from './entities/reminder.entity';
export * from './entities/refresh-token.entity';
export * from './entities/audit-log.entity';
export * from './entities/ai-interaction.entity';

// Value Objects
export * from './value-objects/email.vo';
export * from './value-objects/password.vo';
export * from './value-objects/recurrence.vo';

// Interfaces
export * from './interfaces/ai-provider.interface';
export * from './interfaces/repositories/user.repository.interface';
export * from './interfaces/repositories/task.repository.interface';
export * from './interfaces/repositories/note.repository.interface';
export * from './interfaces/repositories/reminder.repository.interface';
export * from './interfaces/repositories/refresh-token.repository.interface';
export * from './interfaces/repositories/audit-log.repository.interface';
export * from './interfaces/repositories/ai-interaction.repository.interface';

