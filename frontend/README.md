# Frontend - Interpretador de Texto

Interface moderna e elegante para interpretação de texto com IA, inspirada no design system do iOS.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização utilitária
- **Fetch API** - Comunicação com backend

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## ⚙️ Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Design System

### Cores
- Background: `#F9FAFB`
- Surface/Cards: `#FFFFFF`
- Texto primário: `#111827`
- Texto secundário: `#6B7280`
- Azul primário: `#2563EB`
- Azul hover: `#1D4ED8`

### Características
- Cantos arredondados (rounded-xl/2xl)
- Sombras sutis
- Espaçamento generoso
- Tipografia Inter
- Design limpo e minimalista

## 📁 Estrutura

```
src/
├── components/      # Componentes React
├── services/        # Camada de API
├── App.tsx         # Componente principal
└── main.tsx        # Entry point
```

## 🔌 Integração com Backend

O frontend se conecta ao endpoint `POST /interpret` do backend.

**Nota:** Atualmente funciona sem autenticação. Para adicionar autenticação, configure o token no `src/services/api.ts`.
