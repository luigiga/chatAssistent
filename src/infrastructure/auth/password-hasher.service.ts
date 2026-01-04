/**
 * Implementação do serviço de hash de senhas usando Argon2
 */
import { Injectable } from '@nestjs/common';
import { PasswordHasher } from './password-hasher.interface';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
}

