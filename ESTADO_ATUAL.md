# 📋 Estado Atual da Aplicação - Chat Assistant

**Data:** Dezembro 2024  
**Versão:** 1.0.0  
**Status:** MVP em desenvolvimento ativo

---

## 🎯 Visão Geral

Aplicação **backend-first** para transformar mensagens em linguagem natural (PT-BR) em ações estruturadas (tasks, reminders, recurring reminders e notes). A aplicação utiliza IA para interpretar intenções do usuário e retornar dados estruturados.

### Objetivo Principal
Transformar texto livre do usuário em ações estruturadas através de um assistente conversacional com interface moderna estilo iOS/ChatGPT.

---

## 🏗️ Arquitetura

A aplicação segue rigorosamente os princípios de **Clean Architecture** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│           API Layer (NestJS)            │
│  Controllers, Guards, Filters, DTOs    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Application Layer (Use Cases)      │
│     Lógica de negócio, Casos de uso     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Domain Layer (Pure)             │
│  Entities, Value Objects, Interfaces   │
│     (SEM dependências de framework)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Infrastructure Layer (Concrete)      │
│  Prisma, JWT, AI Providers, Repos       │
└─────────────────────────────────────────┘
```

### Princípios Aplicados
- ✅ Domínio isolado (sem dependências de framework)
- ✅ Inversão de dependências (interfaces no domínio)
- ✅ Separação de responsabilidades
- ✅ Testabilidade (mocks e testes isolados)

---

## 📦 Stack Tecnológica

### Backend
- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript 5.3+
- **Framework:** NestJS 10.3
- **ORM:** Prisma 5.9
- **Banco de Dados:** PostgreSQL 14+
- **Autenticação:** JWT + Refresh Token (Argon2 para hash)
- **Validação:** Zod 3.22
- **Testes:** Jest 29.7 + Supertest
- **Build Tool:** NestJS CLI

### Frontend
- **Framework:** React 19.2 + TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Estilização:** Tailwind CSS 3.4
- **HTTP Client:** Fetch API nativo
- **Font:** Inter (Google Fonts)

### DevOps
- **Container:** Docker Compose (PostgreSQL)
- **Process Manager:** Concurrently (dev scripts)

---

## 📁 Estrutura do Projeto

```
chatAssistent/
├── src/                          # Backend
│   ├── domain/                   # Camada de Domínio
│   │   ├── entities/             # Entidades de negócio
│   │   │   ├── user.entity.ts
│   │   │   ├── task.entity.ts
│   │   │   ├── note.entity.ts
│   │   │   ├── reminder.entity.ts
│   │   │   ├── refresh-token.entity.ts
│   │   │   ├── audit-log.entity.ts
│   │   │   └── ai-interaction.entity.ts
│   │   ├── value-objects/         # Value Objects
│   │   │   ├── email.vo.ts
│   │   │   ├── password.vo.ts
│   │   │   └── recurrence.vo.ts
│   │   └── interfaces/           # Contratos
│   │       ├── ai-provider.interface.ts
│   │       └── repositories/
│   │
│   ├── application/              # Camada de Aplicação
│   │   ├── use-cases/            # Casos de uso
│   │   │   ├── auth/
│   │   │   │   ├── register.use-case.ts
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── refresh-token.use-case.ts
│   │   │   │   └── logout.use-case.ts
│   │   │   └── interpret/
│   │   │       └── interpret.use-case.ts
│   │   └── dto/                  # Data Transfer Objects
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       ├── interpret.dto.ts
│   │       └── interpret-response.dto.ts
│   │
│   ├── infrastructure/           # Camada de Infraestrutura
│   │   ├── database/
│   │   │   └── prisma.service.ts
│   │   ├── auth/
│   │   │   ├── jwt.service.ts
│   │   │   ├── password-hasher.service.ts
│   │   │   └── tokens.ts
│   │   ├── ai/                   # Providers de IA
│   │   │   ├── mock-ai-provider.service.ts
│   │   │   ├── real-ai-provider.service.ts
│   │   │   ├── prompt.ts
│   │   │   ├── ai-response.validator.ts
│   │   │   └── ai-response.mapper.ts
│   │   └── repositories/         # Implementações Prisma
│   │       ├── prisma-user.repository.ts
│   │       ├── prisma-refresh-token.repository.ts
│   │       └── prisma-ai-interaction.repository.ts
│   │
│   └── api/                      # Camada de API
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── interpret.controller.ts
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       ├── decorators/
│       │   ├── public.decorator.ts
│       │   └── current-user.decorator.ts
│       ├── filters/
│       │   └── zod-exception.filter.ts
│       ├── modules/
│       │   ├── auth.module.ts
│       │   └── interpret.module.ts
│       └── main.ts
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── LoadingIndicator.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── prisma/
│   ├── schema.prisma            # Schema do banco
│   └── migrations/              # Migrações
│
├── test/                         # Testes E2E
│   ├── auth.e2e-spec.ts
│   └── interpret.e2e-spec.ts
│
├── package.json
├── docker-compose.yml
├── .env                          # Variáveis de ambiente
└── README.md
```

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação (Backend)
- ✅ **Registro de usuário** (`POST /auth/register`)
  - Validação de email e senha
  - Hash com Argon2
  - Retorna JWT + Refresh Token
  
- ✅ **Login** (`POST /auth/login`)
  - Validação de credenciais
  - Retorna JWT + Refresh Token
  
- ✅ **Refresh Token** (`POST /auth/refresh`)
  - Rotação de tokens
  - Revogação de tokens antigos
  
- ✅ **Logout** (`POST /auth/logout`)
  - Revogação de refresh token

### 🤖 Interpretação com IA (Backend)
- ✅ **Endpoint `/interpret`** (`POST /interpret`)
  - Requer autenticação JWT
  - Recebe texto do usuário
  - Chama provider de IA (mock ou real)
  - Valida resposta com Zod
  - Persiste interação no banco
  - Retorna interpretação estruturada

- ✅ **Provider Mock de IA**
  - Funciona sem API externa
  - Lógica baseada em keywords
  - Suporta tasks, notes, reminders, unknown

- ✅ **Provider Real de IA** (OpenAI)
  - Integração com OpenAI API
  - Fallback automático para mock se `AI_API_KEY` não configurada
  - Validação robusta de respostas
  - Timeout e tratamento de erros
  - Limite de input/output tokens

### 💬 Interface de Chat (Frontend)
- ✅ **Interface de chat completa**
  - Header fixo com ícone
  - Área de mensagens com scroll automático
  - Balões de mensagem (usuário/assistente/erro)
  - Barra de entrada fixa na parte inferior
  - Indicador de loading ("pensando...")
  
- ✅ **Formatação de respostas**
  - Tarefas formatadas com emojis
  - Notas formatadas
  - Lembretes com data/hora
  - Mensagens de confirmação
  
- ✅ **Tratamento de erros**
  - Balões de erro em vermelho
  - Mensagens de erro amigáveis

### 🗄️ Banco de Dados
- ✅ **Schema Prisma completo**
  - User (usuários)
  - RefreshToken (tokens de refresh)
  - Task (tarefas)
  - Note (notas)
  - Reminder (lembretes)
  - AuditLog (logs de auditoria)
  - AIInteraction (histórico de interações com IA)

### 🧪 Testes
- ✅ **Testes E2E**
  - Autenticação (register, login, refresh, logout)
  - Interpretação (vários cenários)
  - Limpeza de dados entre testes

- ✅ **Testes Unitários**
  - Entidades de domínio
  - Value Objects
  - Providers de IA

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Instalar Dependências

```bash
# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://appuser:apppassword@localhost:5432/task_assistant?schema=public"

# JWT
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="seu-refresh-token-secret-aqui"
REFRESH_TOKEN_EXPIRES_IN="7d"

# IA (Opcional - se não configurar, usa mock)
AI_API_KEY="sk-your-openai-api-key"
AI_API_URL="https://api.openai.com/v1/chat/completions"
AI_MODEL="gpt-3.5-turbo"
AI_MAX_TOKENS=500
AI_TIMEOUT=30000
AI_MAX_INPUT_LENGTH=2000

# Server
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### 3. Iniciar Banco de Dados

```bash
docker-compose up -d
```

### 4. Executar Migrações

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Iniciar Aplicação

```bash
# Inicia backend e frontend simultaneamente
npm run dev
```

Isso iniciará:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Backend + Frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Backend
npm run start:dev        # NestJS em modo watch
npm run build            # Build de produção
npm run start:prod       # Executar build

# Testes
npm test                 # Testes unitários
npm run test:watch       # Testes em modo watch
npm run test:cov         # Cobertura de testes
npm run test:e2e         # Testes E2E

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate  # Executar migrações
npm run prisma:studio   # Abrir Prisma Studio
```

---

## 🔌 Endpoints da API

### Autenticação

#### `POST /auth/register`
Registra um novo usuário.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### `POST /auth/login`
Autentica um usuário existente.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### `POST /auth/refresh`
Renova o access token usando refresh token.

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200):**
```json
{
  "accessToken": "novo-jwt-token",
  "refreshToken": "novo-refresh-token"
}
```

#### `POST /auth/logout`
Revoga um refresh token.

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (204):** Sem conteúdo

---

### Interpretação

#### `POST /interpret`
Interpreta uma mensagem do usuário usando IA.

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "text": "Lembrar de pagar internet dia 10"
}
```

**Response (200):**
```json
{
  "interpretation": {
    "needs_confirmation": false,
    "action_type": "reminder",
    "reminder": {
      "title": "Pagar internet",
      "reminder_date": "2024-12-10T09:00:00-03:00"
    }
  },
  "interactionId": "uuid",
  "executed": false
}
```

**Tipos de `action_type`:**
- `task` - Tarefa
- `note` - Nota
- `reminder` - Lembrete
- `unknown` - Não identificado (requer confirmação)

---

## 🎨 Frontend - Interface de Chat

### Componentes Principais

1. **ChatWindow** - Container principal com scroll
2. **MessageBubble** - Balões de mensagem (usuário/assistente/erro/loading)
3. **MessageInput** - Barra de entrada fixa
4. **LoadingIndicator** - Indicador "pensando..." com dots animados

### Paleta de Cores

- **Background:** `#F9FAFB`
- **Balão Usuário:** `#DBEAFE` (azul claro)
- **Balão Assistente:** `#FFFFFF` (branco)
- **Texto Principal:** `#111827`
- **Texto Secundário:** `#6B7280`
- **Azul Ação:** `#2563EB`
- **Erro:** `#DC2626`

### Características de Design

- ✅ Design inspirado em iOS/ChatGPT
- ✅ Balões arredondados com sombras sutis
- ✅ Scroll automático para última mensagem
- ✅ Barra de entrada fixa na parte inferior
- ✅ Feedback visual de loading
- ✅ Tratamento de erros com balões vermelhos
- ✅ Formatação rica de respostas (emojis, estrutura)

---

## 🔒 Segurança

### Implementado
- ✅ Hash de senhas com Argon2
- ✅ JWT com expiração curta (15min)
- ✅ Refresh Tokens rotacionáveis
- ✅ Validação de entrada com Zod
- ✅ CORS configurado
- ✅ Rate limiting (NestJS Throttler)
- ✅ Guards de autenticação

### Observações
- ⚠️ O endpoint `/interpret` **requer autenticação JWT**
- ⚠️ O frontend atualmente **não implementa autenticação** (preparado para receber token)
- ⚠️ Para testar o frontend, será necessário:
  - Implementar login no frontend, OU
  - Temporariamente remover o guard do endpoint `/interpret`

---

## 🧪 Testes

### Cobertura Atual

- ✅ **Testes E2E:**
  - Autenticação completa (register, login, refresh, logout)
  - Interpretação com vários cenários
  - Limpeza de dados entre testes

- ✅ **Testes Unitários:**
  - Entidades de domínio (Task, Note, Reminder, User)
  - Value Objects (Email, Password, Recurrence)
  - Providers de IA (Mock e Real)

### Executar Testes

```bash
# Todos os testes
npm test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📊 Modelo de Dados

### Entidades Principais

#### User
- `id` (UUID)
- `email` (único)
- `passwordHash`
- `name` (opcional)
- `createdAt`, `updatedAt`

#### Task
- `id`, `userId`, `title`, `description`
- `completed`, `dueDate`, `priority`
- `createdAt`, `updatedAt`, `completedAt`

#### Note
- `id`, `userId`, `title` (opcional), `content`
- `createdAt`, `updatedAt`

#### Reminder
- `id`, `userId`, `title`, `description`
- `reminderDate`, `isRecurring`, `recurrenceRule`
- `completed`, `createdAt`, `updatedAt`, `completedAt`

#### AIInteraction
- `id`, `userId`, `userInput`, `aiResponse` (JSON)
- `needsConfirmation`, `confirmed`
- `createdAt`

#### RefreshToken
- `id`, `token` (único), `userId`
- `expiresAt`, `createdAt`, `revokedAt`

#### AuditLog
- `id`, `userId`, `action`, `entityType`, `entityId`
- `metadata` (JSON), `createdAt`

---

## 🚧 Funcionalidades Pendentes

### Backend
- [ ] CRUD completo de Tasks
- [ ] CRUD completo de Notes
- [ ] CRUD completo de Reminders
- [ ] Execução automática de ações (quando `needs_confirmation = false`)
- [ ] Sistema de confirmação de ações pendentes
- [ ] Endpoints de consulta (listar tasks, notes, etc)
- [ ] Filtros e paginação
- [ ] Notificações de lembretes

### Frontend
- [ ] Tela de login/registro
- [ ] Gerenciamento de autenticação (armazenar token)
- [ ] Lista de tasks/notes/reminders
- [ ] Visualização detalhada de itens
- [ ] Edição de tasks/notes
- [ ] Confirmação de ações pendentes
- [ ] Histórico de conversas

### Infraestrutura
- [ ] Deploy e CI/CD
- [ ] Monitoramento e logs
- [ ] Documentação Swagger/OpenAPI
- [ ] Testes de carga

---

## 📝 Notas Importantes

### Autenticação no Frontend
O frontend está **preparado** para receber tokens (parâmetro opcional em `interpretText`), mas **não implementa** login ainda. Para testar:

1. **Opção 1:** Implementar tela de login no frontend
2. **Opção 2:** Temporariamente remover `@UseGuards(JwtAuthGuard)` do `InterpretController`
3. **Opção 3:** Usar Postman/Insomnia para obter token e testar manualmente

### Provider de IA
- Se `AI_API_KEY` estiver configurada → usa `RealAIProvider` (OpenAI)
- Se não configurada → usa `MockAIProvider` (fallback automático)
- O mock funciona perfeitamente para desenvolvimento e testes

### Banco de Dados
- PostgreSQL via Docker Compose
- Migrações Prisma aplicadas
- Schema completo e funcional

### Desenvolvimento
- Hot reload ativo (backend e frontend)
- TypeScript strict mode
- ESLint + Prettier configurados
- Path aliases configurados (`@domain`, `@application`, etc)

---

## 🎯 Próximos Passos Sugeridos

1. **Implementar autenticação no frontend**
   - Tela de login/registro
   - Armazenamento seguro de tokens
   - Interceptadores de requisição

2. **CRUD de Tasks**
   - Criar, listar, atualizar, deletar
   - Filtros e busca
   - Interface no frontend

3. **Sistema de confirmação**
   - Endpoint para confirmar ações pendentes
   - Interface de confirmação no frontend

4. **Melhorias de UX**
   - Histórico de conversas
   - Busca de mensagens
   - Exportação de dados

---

## 📞 Contato e Suporte

Para dúvidas ou problemas:
- Verificar logs do backend (console)
- Verificar console do navegador (frontend)
- Executar testes para validar funcionalidades
- Consultar documentação do NestJS/Prisma se necessário

---

**Última atualização:** Dezembro 2024  
**Versão do documento:** 1.0

