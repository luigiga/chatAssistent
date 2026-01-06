# Stack de UI - Lumeo

Este documento define o stack de UI padronizado do projeto Lumeo, garantindo consistência visual, acessibilidade e uma experiência iOS-like moderna, calma e premium.

## 🎯 Princípios de Design

- **iOS-like**: Visual calmo, premium e minimalista
- **Mobile-first**: Design pensado primeiro para mobile
- **Acessibilidade**: Componentes acessíveis por padrão
- **Consistência**: Tokens e padrões reutilizáveis
- **Menos é mais**: Evitar poluição visual

## 📦 Tecnologias Permitidas

### 1. TailwindCSS ⭐ (Prioritário)

**Uso:**
- Classes utilitárias para layout, spacing, tipografia e cores
- Manter tokens consistentes (ex: `rounded-2xl`, `shadow-sm`, `text-sm`)

**Tokens Padronizados:**
```tsx
// Bordas
rounded-xl    // 12px
rounded-2xl   // 16px - padrão para cards
rounded-3xl   // 24px

// Sombras
shadow-sm     // Sombra leve (padrão)
shadow-md     // Sombra média (hover)
shadow-lg     // Sombra grande (raramente usado)

// Espaçamento
p-4, p-5, p-6  // Padding interno
gap-3, gap-4, gap-5  // Espaçamento entre elementos
space-y-4, space-y-5  // Espaçamento vertical

// Tipografia
text-sm       // 14px - texto secundário
text-base     // 16px - texto padrão
text-lg       // 18px - títulos secundários
text-xl       // 20px - títulos principais
fontWeight: 400  // Texto normal
fontWeight: 500  // Labels
fontWeight: 600  // Títulos
```

**Exemplo:**
```tsx
<div className="rounded-2xl p-6 shadow-sm bg-white border border-border">
  <h2 className="text-xl text-text-primary mb-3" style={{ fontWeight: 600 }}>
    Título
  </h2>
  <p className="text-sm text-text-secondary leading-relaxed">
    Conteúdo
  </p>
</div>
```

### 2. shadcn/ui ⭐ (Componentes Base)

**Componentes Disponíveis:**
- `Button` - Botões com variantes (default, secondary, outline, ghost, link)
- `Card` - Cards com estrutura (CardHeader, CardTitle, CardContent, etc.)
- Outros componentes podem ser adicionados conforme necessário

**Uso:**
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Button
<Button variant="default" size="default">Salvar</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
<Button variant="outline" size="lg">Ação</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

**Regras:**
- Preferir variantes `ghost`, `secondary`, `outline` quando aplicável
- Evitar estilos "pesados" ou altamente contrastantes
- Manter consistência com o design system iOS-like

### 3. Radix UI (via shadcn/ui)

**Uso:**
- Acessibilidade automática (focus ring, keyboard nav, ARIA)
- Não reinventar componentes já cobertos por shadcn
- Usado indiretamente através dos componentes shadcn/ui

### 4. lucide-react ⭐ (Ícones)

**Uso:**
```tsx
import { Sparkles, Bell, FileText, CheckCircle2 } from 'lucide-react';

<Sparkles className="w-5 h-5 text-blue-primary" strokeWidth={2} />
<Bell className="w-4 h-4 text-text-secondary/60" strokeWidth={2} />
```

**Regras:**
- Tamanho padrão: 16-20px (`w-4 h-4` ou `w-5 h-5`)
- Cor neutra por padrão (`text-text-secondary/60`)
- Azul apenas em estados ativos (`text-blue-primary`)
- `strokeWidth={2}` para consistência visual
- **NUNCA usar emojis como elementos estruturais da UI**

### 5. Framer Motion (Microinterações)

**Uso:**
```tsx
import { motion } from 'framer-motion';

// Fade in suave
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Conteúdo
</motion.div>

// Scale em press (botões)
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Clique
</motion.button>

// Slide leve
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Nova memória
</motion.div>
```

**Regras:**
- Duração curta: 200-500ms
- Easing suave: `easeOut` ou `easeInOut`
- Scale em press: `0.98` (nunca menor que 0.95)
- Evitar animações chamativas ou repetitivas
- Usar apenas quando adiciona valor à UX

### 6. Magic UI (Opcional - Efeitos Sutis)

**Permitido para:**
- Gradients suaves
- Blur leve (`backdrop-blur-sm`)
- Shimmer discreto em skeleton loaders

**NÃO usar:**
- Efeitos exagerados ou brilhantes
- Qualquer coisa que gere aparência "demo/portfolio"

## 🚫 Tecnologias NÃO Permitidas

- **Material UI / MUI** - Impoem estilo Android/Material
- **Qualquer UI kit que imponha estilo Android/Material**
- **Emojis como elementos estruturais** - Usar apenas no conteúdo do usuário

## 📐 Regras Globais de Design

### Layout
- **Mobile-first**: Design pensado primeiro para mobile
- **Muito espaço em branco**: Respiro generoso entre elementos
- **Cards grandes**: Padding generoso (`p-5`, `p-6`)
- **Bordas grandes**: `rounded-2xl` (16px) para cards

### Tipografia
- **Fonte**: Roboto (já configurada)
- **Pesos**: 400 (texto), 500 (labels), 600 (títulos)
- **Tamanhos confortáveis**: `text-sm` (14px) mínimo para legibilidade
- **Line-height**: `leading-relaxed` para textos longos

### Cores
- **Suaves**: Azul/cinza/branco
- **Sem contrastes agressivos**: Evitar cores muito saturadas
- **Hierarquia clara**: `text-text-primary` para conteúdo, `text-text-secondary` para metadados

### Espaçamento
- **Vertical**: `space-y-4`, `space-y-5`, `space-y-6` entre elementos
- **Horizontal**: `gap-3`, `gap-4`, `gap-5` em flex/grid
- **Padding interno**: `p-4`, `p-5`, `p-6` em cards

### Sombras
- **Leve**: `shadow-sm` (padrão)
- **Hover**: `shadow-md`
- **Raramente**: `shadow-lg`

## 🎨 Exemplo de Componente Padrão

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExampleCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-primary/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-primary/60" strokeWidth={2} />
            </div>
            <CardTitle className="text-lg">Título do Card</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Conteúdo do card com texto secundário.
          </p>
          <div className="flex gap-3">
            <Button variant="default" size="default">
              Ação Principal
            </Button>
            <Button variant="ghost" size="default">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

## 🔧 Utilitários

### `cn()` - Combinar classes Tailwind

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-2xl p-6',
  isActive && 'bg-blue-primary/5',
  className
)}>
```

## ✅ Checklist de Componente

Antes de criar um novo componente, verificar:

- [ ] Usa tokens Tailwind padronizados (`rounded-2xl`, `shadow-sm`, etc.)
- [ ] Ícones são do `lucide-react` (não emojis)
- [ ] Tamanhos de ícone consistentes (16-20px)
- [ ] Cores suaves, sem contrastes agressivos
- [ ] Espaçamento generoso
- [ ] Tipografia confortável (mínimo `text-sm`)
- [ ] Acessibilidade (focus states, ARIA quando necessário)
- [ ] Animações sutis (se aplicável, usando Framer Motion)
- [ ] Visual iOS-like, não Material/Android

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Lucide Icons](https://lucide.dev/icons)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Última atualização**: 2024
**Mantido por**: Equipe Lumeo

