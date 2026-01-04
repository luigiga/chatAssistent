/**
 * Módulo principal da aplicação
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { InterpretModule } from './modules/interpret.module';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    InterpretModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

