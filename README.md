# Chat Assistant - Assistente de Tarefas por Conversa

Aplicação backend-first para transformar mensagens em linguagem natural (PT-BR) em ações estruturadas (tasks, reminders, recurring reminders e notes).

## 🏗️ Arquitetura

A aplicação segue os princípios de **Clean Architecture** com separação clara entre:

- **Domain**: Entidades, Value Objects e Interfaces (sem dependências de framework)
- **Application**: Casos de uso e lógica de negócio
- **Infrastructure**: Implementações concretas (Prisma, JWT, etc)
- **API**: Controllers e DTOs (NestJS)

## 📋 Stack Tecnológica

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime
- **NestJS** - Framework backend
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Jest** - Testes
- **Zod** - Validação
- **JWT + Refresh Token** - Autenticação
- **Argon2** - Hash de senhas

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### Passos

1. **Clone o repositório** (se aplicável)

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/chat_assistant?schema=public"
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="seu-refresh-token-secret-aqui"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

4. **Configure o banco de dados:**
```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar as migrações
npm run prisma:migrate
```

5. **Inicie o servidor:**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Camada de Domínio (sem dependências de framework)
│   ├── entities/        # Entidades de negócio
│   ├── value-objects/   # Value Objects
│   └── interfaces/      # Interfaces (contratos)
│
├── application/         # Camada de Aplicação (casos de uso)
│   ├── use-cases/       # Casos de uso
│   └── dto/             # Data Transfer Objects
│
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/        # Implementações Prisma
│   ├── auth/            # Implementações JWT
│   ├── ai/              # Implementações de providers de IA
│   └── repositories/    # Implementações dos repositórios
│
└── api/                 # Camada de API (NestJS)
    ├── controllers/     # Controllers
    ├── guards/          # Guards (Auth, etc)
    ├── decorators/      # Decorators customizados
    └── main.ts          # Entry point
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura
npm run test:cov

# Executar testes E2E
npm run test:e2e
```

## 🔒 Segurança

- **Password Hashing**: Argon2
- **Rate Limiting**: Implementado em endpoints sensíveis
- **CORS**: Configurado de forma restritiva
- **JWT**: Tokens com expiração curta (15min)
- **Refresh Tokens**: Rotacionáveis e revogáveis
- **Auditoria**: Logs de todas as ações importantes

## 📝 Funcionalidades (MVP)

### ✅ Implementado

- [x] Estrutura do projeto
- [x] Domínio completo (entidades, value objects, interfaces)
- [x] Schema Prisma

### 🚧 Em Desenvolvimento

- [ ] Autenticação (registro, login, refresh token)
- [ ] Endpoint POST /interpret
- [ ] CRUD de tasks e notes
- [ ] Sistema de auditoria
- [ ] Persistência de interações com IA

## 🎯 Próximos Passos

1. Implementar camada de Application (use cases)
2. Implementar camada de Infrastructure (repositórios Prisma)
3. Implementar camada de API (controllers NestJS)
4. Implementar provider de IA (mockável)
5. Implementar autenticação JWT
6. Adicionar testes unitários e de integração

## 📄 Licença

MIT

