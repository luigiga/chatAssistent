# 🏗️ Arquitetura do Projeto – Assistente de Tarefas por Conversa

Este documento define **as regras arquiteturais oficiais** do projeto.
Qualquer código, feature ou refatoração **deve seguir este guia**.

> Objetivo: manter o sistema **simples, testável, seguro e evolutivo**.

---

## 🎯 Visão Geral

Aplicação backend-first que transforma mensagens em linguagem natural (PT-BR) em ações estruturadas:

* Tarefas
* Lembretes
* Lembretes recorrentes
* Notas

A IA **interpreta**, mas **não decide nem executa**.

---

## 🧠 Princípios Fundamentais

1. **Separação de responsabilidades**
2. **Domínio independente de frameworks**
3. **Tudo que importa é testável**
4. **Segurança por padrão**
5. **Nada implícito ou mágico**

---

## 🗂️ Camadas da Arquitetura (Clean Architecture)

### 1️⃣ Domain (núcleo do sistema)

📍 Não depende de NestJS, Prisma, banco ou IA.

Responsável por:

* Entidades (Task, Recurrence, Note, User)
* Regras de negócio
* Validações
* Invariantes

🚫 Proibido no domínio:

* Decorators
* DTOs
* HTTP
* Banco de dados
* Serviços externos

📦 Exemplo de estrutura:

```
/domain
  /entities
  /value-objects
  /errors
```

---

### 2️⃣ Application (casos de uso)

📍 Orquestra o domínio.

Responsável por:

* Casos de uso (CreateTask, InterpretMessage)
* Coordenação entre domínio e infraestrutura
* Decisões de fluxo

Pode depender de:

* Interfaces
* Contratos

Não pode depender de:

* Implementações concretas

---

### 3️⃣ Infrastructure (implementações)

📍 Onde vivem as coisas reais.

Responsável por:

* Prisma
* Banco de dados
* Providers de IA
* Hash de senha
* JWT

Aqui mora o "como", nunca o "por quê".

---

### 4️⃣ API (interface externa)

📍 Camada mais burra possível.

Responsável por:

* Controllers
* DTOs
* Validação de entrada (Zod)
* Autenticação

🚫 Controllers NÃO:

* contêm regras de negócio
* acessam banco diretamente

---

## 🔐 Segurança (obrigatório)

### Autenticação

* JWT de curta duração
* Refresh token rotacionável
* Refresh tokens armazenados com hash

### Autorização

* Toda query filtrada por user_id
* Nunca confiar em dados do client

### IA

* Input sanitizado
* Limite de tamanho
* Timeout
* Resposta validada por schema

---

## 🧪 Estratégia de Testes

### Testes Unitários

* Domínio (prioridade máxima)
* Casos de uso

### Testes de Integração

* Endpoints
* Autenticação
* Persistência

### Testes de Regressão Semântica

* Dataset fixo de frases
* Verificação de tipo e flags

🚫 Testes nunca dependem de serviços externos.

---

## 🤖 Inteligência Artificial

### Papel da IA

* Interpretar texto
* Retornar estrutura

### Limitações

* IA não cria registros diretamente
* IA não decide datas finais
* IA não executa lógica

### Contrato

* Sempre JSON válido
* Validado via Zod
* Falha = fallback seguro

---

## 📜 Auditoria & Logs

Tudo que altera estado relevante:

* É auditado
* É rastreável

Logs devem:

* Ajudar debugging
* Nunca conter dados sensíveis

---

## 🚦 Regras de Evolução

Antes de adicionar qualquer feature:

1. Onde isso vive? (camada)
2. É testável?
3. Que regra protege isso?

Se não souber responder, **não implemente ainda**.

---

## 🧠 Regra Final

> Código simples sobrevive.
> Código mágico cobra juros.

Este documento é a **fonte da verdade arquitetural** do projeto.
