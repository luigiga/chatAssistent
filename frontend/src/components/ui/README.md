# Componentes UI - Lumeo

Componentes base do design system Lumeo, seguindo padrões iOS-like, calmos e premium.

## Componentes Disponíveis

### Button

Botão com variantes e tamanhos padronizados.

```tsx
import { Button } from '@/components/ui/button';

// Variantes
<Button variant="default">Padrão</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Ícone</Button>
```

### Card

Card com estrutura flexível.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
  <CardFooter>
    Ações do card
  </CardFooter>
</Card>
```

## Adicionando Novos Componentes

Para adicionar novos componentes do shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Exemplos:
- `npx shadcn@latest add dialog`
- `npx shadcn@latest add tabs`
- `npx shadcn@latest add tooltip`

**Importante**: Após adicionar, revisar os estilos para garantir que seguem os padrões iOS-like do Lumeo (cores suaves, espaçamento generoso, bordas grandes).

## Padrões de Uso

Todos os componentes devem seguir:

1. **Cores suaves**: Evitar contrastes agressivos
2. **Espaçamento generoso**: `p-5`, `p-6` em cards
3. **Bordas grandes**: `rounded-2xl` (16px)
4. **Sombras leves**: `shadow-sm` padrão, `shadow-md` no hover
5. **Tipografia confortável**: Mínimo `text-sm` (14px)
6. **Acessibilidade**: Focus states, ARIA quando necessário

Veja `UI_STACK.md` na raiz do projeto para mais detalhes.

