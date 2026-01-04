# Integração com IA Real

Este documento descreve como configurar e usar a integração real com IA no endpoint `/interpret`.

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Configuração da IA
AI_API_KEY=sk-your-api-key-here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-3.5-turbo
AI_MAX_TOKENS=500
AI_TIMEOUT=30000
AI_MAX_INPUT_LENGTH=2000
```

### Variáveis Opcionais

- `AI_API_URL`: URL da API da IA (padrão: OpenAI)
- `AI_MODEL`: Modelo a ser usado (padrão: gpt-3.5-turbo)
- `AI_MAX_TOKENS`: Número máximo de tokens na resposta (padrão: 500)
- `AI_TIMEOUT`: Timeout em milissegundos (padrão: 30000)
- `AI_MAX_INPUT_LENGTH`: Tamanho máximo do input em caracteres (padrão: 2000)

## Comportamento

### Com AI_API_KEY configurada

O sistema usará o `RealAIProvider`, que faz chamadas reais à API de IA.

### Sem AI_API_KEY configurada

O sistema automaticamente usa o `MockAIProvider` como fallback, permitindo desenvolvimento e testes sem custos de API.

## Formato da Resposta da IA

A IA deve retornar JSON no seguinte formato:

```json
{
  "intent": "create_task" | "update_task" | "delete_task" | "query_task" | "unknown",
  "title": string | null,
  "description": string | null,
  "dueDate": string | null (ISO 8601),
  "priority": "low" | "medium" | "high" | null
}
```

## Validação

Todas as respostas da IA são validadas usando Zod antes de serem processadas. Se a validação falhar, o sistema retorna uma resposta `unknown` com `needs_confirmation: true`.

## Tratamento de Erros

- **Timeout**: Se a chamada à IA exceder o timeout configurado, retorna `unknown`
- **Erro de API**: Se a API retornar erro, retorna `unknown`
- **Resposta inválida**: Se a resposta não passar na validação Zod, retorna `unknown`
- **JSON inválido**: Se a resposta não for JSON válido, retorna `unknown`

## Logging

O sistema registra logs (sem dados sensíveis):

- Modelo usado
- Tamanho do input
- Intent identificado
- Erros (sem expor API keys)

## Testes

Os testes unitários mockam a API da IA usando `jest.fn()` para `global.fetch`. Nenhum teste chama a API real.

## Segurança

- API keys nunca são logadas
- Input é limitado em tamanho
- Timeout previne chamadas infinitas
- Validação rigorosa de todas as respostas
- Isolamento completo da IA (não acessa banco, não executa ações)
