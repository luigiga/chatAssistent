# 📋 Estado Atual do Desenvolvimento - Lumeo

**Data:** Janeiro 2026  
**Versão:** 1.0.0  
**Status:** Em desenvolvimento ativo

---

## 🎯 Visão Geral

**Lumeo** é um assistente de memória pessoal que interpreta texto livre do usuário e organiza automaticamente em tarefas, notas e lembretes. A aplicação utiliza IA para interpretação semântica e oferece uma interface moderna inspirada no iOS.

### Conceito do Produto

- **Não é um chat genérico**: foco em memória e ações silenciosas
- **Interpretação automática**: IA entende intenções e cria entidades automaticamente
- **UX minimalista**: design limpo e intuitivo
- **Assistente silencioso**: funciona em background, organizando informações

---

## 🏗️ Arquitetura

### Stack Tecnológica

**Backend:**
- Node.js + TypeScript
- NestJS (framework)
- PostgreSQL (banco de dados)
- Prisma (ORM)
- JWT + Refresh Tokens (autenticação)
- Argon2 (hash de senhas)
- Zod (validação)

**Frontend:**
- React + TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- Fetch API (comunicação HTTP)

### Arquitetura em Camadas (Clean Architecture)

```
src/
├── domain/              # Camada de Domínio (entidades, interfaces)
│   ├── entities/        # Entidades de negócio
│   ├── interfaces/      # Contratos (repositórios, providers)
│   └── value-objects/  # Value Objects
├── application/         # Camada de Aplicação (casos de uso)
│   ├── use-cases/      # Casos de uso
│   └── dto/            # Data Transfer Objects
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/       # Prisma
│   ├── repositories/   # Implementações dos repositórios
│   ├── ai/             # Providers de IA (Real, Mock, Fallback)
│   └── auth/           # JWT, Password Hashing
└── api/                # Camada de API (NestJS)
    ├── controllers/    # Controllers REST
    ├── modules/        # Módulos NestJS
    ├── guards/         # Guards de autenticação
    └── filters/        # Exception filters
```

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação

- [x] Registro de usuário
- [x] Login com JWT
- [x] Refresh token rotacionável
- [x] Logout com revogação de token
- [x] Hash de senhas com Argon2
- [x] Validação de entrada com Zod
- [x] Guards de autenticação em endpoints protegidos

**Endpoints:**
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Fazer logout

### 🤖 Interpretação de IA

- [x] Integração com OpenAI API (GPT-3.5-turbo)
- [x] Provider mockável para testes
- [x] Fallback automático para mock em caso de erro
- [x] Validação de resposta com Zod
- [x] Suporte a múltiplos tipos de ação:
  - `task` - Criar tarefa
  - `note` - Criar nota
  - `reminder` - Criar lembrete
  - `unknown` - Não identificado (requer confirmação)

**Estratégias de Gerenciamento de Quota:**
- [x] **Fallback Automático**: Tenta API real, faz fallback para mock se falhar
- [x] **Rate Limiting**: Limite diário por usuário (padrão: 50 requisições/dia)
- [x] **Cache**: Cacheia interpretações similares por 1 hora
- [x] **Circuit Breaker**: Protege contra falhas em cascata
- [x] **Quota Tracking**: Rastreamento de uso no banco de dados

**Endpoint:**
- `POST /interpret` - Interpretar texto do usuário (requer autenticação)

### 📝 CRUD de Entidades

#### Tasks (Tarefas)
- [x] Criar tarefa
- [x] Listar tarefas (com filtros: completed, priority)
- [x] Buscar tarefa por ID
- [x] Atualizar tarefa
- [x] Deletar tarefa
- [x] Completar tarefa

**Endpoints:**
- `POST /tasks` - Criar tarefa
- `GET /tasks` - Listar tarefas
- `GET /tasks/:id` - Buscar tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `PATCH /tasks/:id/complete` - Completar tarefa

#### Notes (Notas)
- [x] Criar nota
- [x] Listar notas
- [x] Buscar nota por ID
- [x] Atualizar nota
- [x] Deletar nota

**Endpoints:**
- `POST /notes` - Criar nota
- `GET /notes` - Listar notas
- `GET /notes/:id` - Buscar nota
- `PATCH /notes/:id` - Atualizar nota
- `DELETE /notes/:id` - Deletar nota

#### Reminders (Lembretes)
- [x] Criar lembrete
- [x] Listar lembretes
- [x] Buscar lembrete por ID
- [x] Atualizar lembrete
- [x] Deletar lembrete
- [x] Completar lembrete
- [x] Suporte a recorrência (daily, weekly, monthly, yearly)

**Endpoints:**
- `POST /reminders` - Criar lembrete
- `GET /reminders` - Listar lembretes
- `GET /reminders/:id` - Buscar lembrete
- `PATCH /reminders/:id` - Atualizar lembrete
- `DELETE /reminders/:id` - Deletar lembrete
- `PATCH /reminders/:id/complete` - Completar lembrete

### 🎨 Frontend

- [x] Interface de chat moderna (estilo iOS)
- [x] Autenticação (login/registro)
- [x] Timeline de memórias (MemoryTimeline)
- [x] Input de mensagens fixo na parte inferior
- [x] Estados visuais (loading, error, success)
- [x] Refresh automático de token (tratamento de 401)
- [x] Logout automático quando sessão expira
- [x] Design responsivo (mobile-first)

**Componentes Principais:**
- `App.tsx` - Componente raiz com gerenciamento de autenticação
- `MemoryTimeline` - Timeline de memórias/entradas
- `MessageInput` - Input fixo na parte inferior
- `MessageBubble` - Balões de mensagem (usuário/assistente/erro)
- `LoginForm` / `RegisterForm` - Formulários de autenticação
- `AuthContext` - Contexto de autenticação global

### 🔒 Segurança

- [x] Hash de senhas com Argon2
- [x] JWT com expiração curta (15 minutos)
- [x] Refresh tokens rotacionáveis
- [x] Validação de entrada com Zod
- [x] CORS configurado
- [x] Guards de autenticação
- [x] Exception filters para erros padronizados

### 🧪 Testes

- [x] Testes unitários de entidades de domínio
- [x] Testes E2E de autenticação
- [x] Testes E2E de interpretação
- [x] Testes de providers de IA (mock e real)

**Executar testes:**
```bash
npm test              # Testes unitários
npm run test:e2e      # Testes E2E
npm run test:cov       # Cobertura de testes
```

---

## 📊 Modelo de Dados

### Entidades Principais

**User (Usuário)**
- `id` - UUID
- `email` - String único
- `passwordHash` - Hash Argon2
- `name` - String opcional
- `createdAt` / `updatedAt` - Timestamps

**Task (Tarefa)**
- `id` - UUID
- `userId` - Referência ao usuário
- `title` - String
- `description` - String opcional
- `completed` - Boolean
- `dueDate` - DateTime opcional
- `priority` - 'low' | 'medium' | 'high'
- `completedAt` - DateTime opcional

**Note (Nota)**
- `id` - UUID
- `userId` - Referência ao usuário
- `title` - String opcional
- `content` - String
- `createdAt` / `updatedAt` - Timestamps

**Reminder (Lembrete)**
- `id` - UUID
- `userId` - Referência ao usuário
- `title` - String
- `description` - String opcional
- `reminderDate` - DateTime
- `isRecurring` - Boolean
- `recurrenceRule` - String opcional
- `completed` - Boolean
- `completedAt` - DateTime opcional

**AIInteraction (Interação com IA)**
- `id` - UUID
- `userId` - Referência ao usuário
- `userInput` - Texto do usuário
- `aiResponse` - JSON da resposta da IA
- `needsConfirmation` - Boolean
- `confirmed` - Boolean opcional
- `createdAt` - Timestamp

**AIQuotaUsage (Uso de Quota)**
- `id` - UUID
- `userId` - Referência ao usuário
- `date` - Data (início do dia)
- `requestCount` - Número de requisições
- `createdAt` / `updatedAt` - Timestamps

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências do backend
npm install

# 2. Instalar dependências do frontend
cd frontend && npm install && cd ..

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Configurar banco de dados
npm run prisma:generate
npm run prisma:migrate dev

# 5. Iniciar aplicação (backend + frontend)
npm run dev
```

### Variáveis de Ambiente

**Backend (.env):**
```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/task_assistant"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"

# IA (Opcional - se não configurar, usa mock)
AI_API_KEY="sk-your-openai-api-key"
AI_API_URL="https://api.openai.com/v1/chat/completions"
AI_MODEL="gpt-3.5-turbo"
AI_MAX_TOKENS="500"
AI_TIMEOUT="30000"
AI_MAX_INPUT_LENGTH="2000"
AI_DAILY_LIMIT_PER_USER="50"

# Porta
PORT=3000
```

**Frontend (.env ou .env.local):**
```env
VITE_API_URL=http://localhost:3000
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia backend + frontend simultaneamente
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Build
npm run build            # Build do backend
cd frontend && npm run build  # Build do frontend

# Testes
npm test                 # Testes unitários
npm run test:e2e         # Testes E2E
npm run test:cov         # Cobertura

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Criar migration
npm run prisma:studio    # Abrir Prisma Studio
```

---

## 🔧 Configuração de IA

### Modo Mock (Padrão)

Se `AI_API_KEY` não estiver configurada, o sistema usa automaticamente o `MockAIProvider`, que funciona baseado em palavras-chave:

- Detecta tarefas: "fazer", "criar tarefa", "lembrar de"
- Detecta notas: "anotar", "nota", "salvar"
- Detecta lembretes: "lembrar", "alerta", "notificar"
- Suporta recorrência: "toda segunda", "diariamente"

### Modo Real (OpenAI)

Para usar a API real da OpenAI:

1. Configure `AI_API_KEY` no `.env`
2. Adicione créditos na conta da OpenAI
3. O sistema tentará usar a API real
4. Em caso de erro (quota, timeout, etc.), faz fallback automático para mock

### Estratégias de Proteção

O sistema implementa múltiplas camadas de proteção:

1. **Fallback Automático**: Se API real falhar, usa mock
2. **Rate Limiting**: Limite diário por usuário (50 requisições/dia por padrão)
3. **Cache**: Cacheia interpretações similares (evita chamadas repetidas)
4. **Circuit Breaker**: Bloqueia chamadas após 5 falhas consecutivas
5. **Quota Tracking**: Rastreia uso no banco de dados

---

## 📁 Estrutura de Arquivos

```
chatAssistent/
├── src/                          # Backend
│   ├── domain/                   # Camada de domínio
│   │   ├── entities/             # Entidades
│   │   ├── interfaces/           # Contratos
│   │   └── value-objects/        # Value Objects
│   ├── application/             # Camada de aplicação
│   │   ├── use-cases/           # Casos de uso
│   │   └── dto/                 # DTOs
│   ├── infrastructure/           # Infraestrutura
│   │   ├── ai/                  # Providers de IA
│   │   │   ├── real-ai-provider.service.ts
│   │   │   ├── mock-ai-provider.service.ts
│   │   │   ├── fallback-ai-provider.service.ts
│   │   │   ├── ai-rate-limiter.service.ts
│   │   │   ├── ai-cache.service.ts
│   │   │   └── circuit-breaker.service.ts
│   │   ├── repositories/        # Repositórios Prisma
│   │   ├── database/            # Prisma Service
│   │   └── auth/                # JWT, Password Hashing
│   └── api/                     # API (NestJS)
│       ├── controllers/         # Controllers REST
│       ├── modules/             # Módulos NestJS
│       ├── guards/              # Guards de autenticação
│       └── filters/             # Exception filters
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── contexts/            # Contextos (Auth)
│   │   ├── services/             # Serviços de API
│   │   └── App.tsx              # Componente principal
│   └── package.json
├── prisma/                       # Schema Prisma
│   └── schema.prisma
├── test/                         # Testes E2E
├── package.json
└── .env                          # Variáveis de ambiente
```

---

## 🎨 Design System

### Paleta de Cores

- **Background principal**: `#F9FAFB`
- **Surface / Cards**: `#FFFFFF`
- **Texto principal**: `#111827`
- **Texto secundário**: `#6B7280`
- **Azul primário**: `#2563EB`
- **Azul hover**: `#1D4ED8`
- **Azul soft**: `#DBEAFE`
- **Bordas**: `#E5E7EB`
- **Erro**: `#DC2626`
- **Sucesso**: `#16A34A`

### Princípios de Design

- Inspirado no iOS (cantos arredondados, sombras sutis)
- Espaçamento generoso
- Tipografia limpa (Inter)
- Estados visuais claros
- Responsivo (mobile-first)

---

## 🔄 Fluxo de Funcionamento

### 1. Autenticação
```
Usuário → Login → JWT Token → Armazenado no localStorage
```

### 2. Interpretação
```
Usuário digita texto
  ↓
Frontend envia para /interpret (com token)
  ↓
Backend valida token
  ↓
Verifica cache → Se encontrado, retorna
  ↓
Verifica rate limit → Se excedido, retorna erro
  ↓
Verifica circuit breaker → Se aberto, retorna erro
  ↓
Chama AI Provider:
  - Se tem AI_API_KEY → Tenta API real
  - Se falhar → Fallback para mock
  - Se não tem AI_API_KEY → Usa mock diretamente
  ↓
Registra quota no banco
  ↓
Armazena no cache
  ↓
Se needs_confirmation = false → Executa ação automaticamente
  ↓
Retorna resposta para frontend
```

### 3. Refresh de Token
```
Token expira (401)
  ↓
Frontend detecta 401
  ↓
Chama /auth/refresh automaticamente
  ↓
Recebe novo token
  ↓
Tenta requisição novamente
```

---

## 🐛 Problemas Conhecidos

1. **Quota da OpenAI**: Se `AI_API_KEY` estiver configurada mas sem créditos, o sistema tentará usar a API real primeiro. Solução: remover `AI_API_KEY` do `.env` para usar apenas mock.

2. **Prisma Client**: Pode dar erro de permissão ao gerar se o servidor estiver rodando. Solução: parar servidor, gerar, reiniciar.

---

## 📝 Próximos Passos Sugeridos

### Curto Prazo
- [ ] Implementar sistema de confirmação para ações pendentes
- [ ] Adicionar busca/filtros avançados nas listagens
- [ ] Melhorar tratamento de erros no frontend
- [ ] Adicionar notificações push para lembretes

### Médio Prazo
- [ ] Implementar sincronização offline
- [ ] Adicionar exportação de dados (JSON, CSV)
- [ ] Criar dashboard de estatísticas
- [ ] Implementar compartilhamento de notas/tarefas

### Longo Prazo
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com calendários externos
- [ ] App mobile (React Native)
- [ ] Sistema de tags/categorias

---

## 📚 Documentação Adicional

- `ESTADO_ATUAL.md` - Documentação técnica detalhada
- `README.md` - Guia de instalação e uso
- `README_AI_INTEGRATION.md` - Documentação da integração com IA
- `PLANO_EVOLUCAO_LUMEO.md` - Plano de evolução do produto

---

## 👥 Contato e Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor
2. Verificar console do navegador (F12)
3. Consultar documentação nos arquivos `.md`
4. Verificar testes para exemplos de uso

---

**Última atualização:** Janeiro 2026  
**Versão do documento:** 1.0.0

