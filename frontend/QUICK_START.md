# 🚀 Guia Rápido - Frontend

## Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Como Testar

### 1. Certifique-se de que o backend está rodando
```bash
# No diretório raiz do projeto
npm run start:dev
```

### 2. Inicie o frontend
```bash
# No diretório frontend
npm run dev
```

### 3. Teste a interface

1. Abra `http://localhost:5173` no navegador
2. Digite uma mensagem no campo de texto
3. Clique em "Interpretar"
4. Veja o resultado formatado

### Exemplos de mensagens para testar:

- "Criar tarefa de comprar leite amanhã com prioridade alta"
- "Anotar conversa com cliente sobre contrato"
- "Lembrar de pagar internet dia 10"
- "Toda segunda mandar treino"

## 📝 Nota sobre Autenticação

Atualmente o frontend funciona sem autenticação. Se o backend exigir autenticação, você verá um erro 401. Para adicionar autenticação:

1. Implemente login no frontend
2. Armazene o token (localStorage/sessionStorage)
3. Passe o token para `interpretText()` em `src/services/api.ts`

## 🎨 Características do Design

- ✅ Design inspirado no iOS
- ✅ Cores suaves e profissionais
- ✅ Cantos arredondados
- ✅ Sombras sutis
- ✅ Espaçamento generoso
- ✅ Tipografia Inter
- ✅ Responsivo (mobile-first)

