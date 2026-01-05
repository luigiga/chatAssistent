# 🧭 Estrutura Preparada para Navegação Futura

Este documento descreve a estrutura preparada no frontend para suportar navegação futura no Lumeo.

## 📁 Estrutura de Arquivos

```
frontend/src/
├── components/
│   ├── layout/              # Componentes de layout reutilizáveis
│   │   ├── BaseLayout.tsx   # Layout base com suporte para Tab Bar
│   │   ├── MainContent.tsx # Container para conteúdo da tela
│   │   └── AppHeader.tsx   # Header reutilizável
│   └── navigation/          # Componentes de navegação
│       └── TabBar.tsx      # Tab Bar iOS-like (preparado, não ativo)
├── pages/                   # Páginas/Telas da aplicação
│   ├── MemoriesPage.tsx    # Timeline de memórias (tela atual)
│   ├── SearchPage.tsx      # Busca (placeholder)
│   └── ProfilePage.tsx     # Perfil (placeholder)
└── App.tsx                  # Componente principal (usa BaseLayout)
```

## 🎯 Componentes Criados

### 1. BaseLayout (`components/layout/BaseLayout.tsx`)

**Propósito:** Layout base que suporta futura Tab Bar

**Props:**
- `children`: Conteúdo da aplicação
- `showTabBar`: Controla visibilidade da Tab Bar (atualmente `false`)

**Futuro:**
- Quando `showTabBar={true}`, renderiza Tab Bar na parte inferior
- Suporta safe area para dispositivos com notch

### 2. MainContent (`components/layout/MainContent.tsx`)

**Propósito:** Container flexível para conteúdo de cada tela

**Props:**
- `children`: Conteúdo da tela
- `className`: Classes CSS adicionais

**Futuro:**
- Cada tela será renderizada dentro deste container
- Permite animações de transição entre telas

### 3. AppHeader (`components/layout/AppHeader.tsx`)

**Propósito:** Header reutilizável com título e ações

**Props:**
- `title`: Título da tela (padrão: "Lumeo")
- `subtitle`: Subtítulo opcional
- `actions`: Elementos React para ações (botões, etc.)

**Futuro:**
- Título pode mudar dinamicamente baseado na tela atual
- Ações contextuais por tela

### 4. TabBar (`components/navigation/TabBar.tsx`)

**Propósito:** Navegação principal estilo iOS

**Props:**
- `activeTab`: Tab ativa ('memories' | 'search' | 'profile')
- `onTabChange`: Callback quando tab muda

**Status:** Preparado, mas não renderizado (comentado no BaseLayout)

**Tabs planejadas:**
- 📝 **Memórias**: Timeline de todas as memórias
- 🔍 **Busca**: Buscar memórias, tarefas, notas e lembretes
- 👤 **Perfil**: Configurações e estatísticas

## 📄 Páginas Criadas

### 1. MemoriesPage (`pages/MemoriesPage.tsx`)

**Status:** ✅ Implementada e ativa

**Funcionalidade:** Timeline de memórias com input para registrar novas entradas

**Props:**
- `memories`: Lista de memórias
- `onSave`: Handler para salvar nova entrada
- `onConfirm`: Handler para confirmar ação pendente
- `onReject`: Handler para rejeitar ação pendente
- `confirmingIds`: IDs de ações sendo confirmadas
- `isLoading`: Estado de carregamento

### 2. SearchPage (`pages/SearchPage.tsx`)

**Status:** 🚧 Placeholder

**Futuro:**
- Busca full-text em memórias
- Filtros por tipo (task, note, reminder)
- Filtros por data
- Ordenação

### 3. ProfilePage (`pages/ProfilePage.tsx`)

**Status:** 🚧 Placeholder

**Futuro:**
- Informações do usuário
- Estatísticas (total de memórias, tarefas, etc.)
- Configurações (notificações, privacidade)
- Exportação de dados
- Logout

## 🔄 Como Ativar Navegação (Futuro)

### Passo 1: Adicionar estado de navegação

```typescript
// Em App.tsx ou MemoryInterface
const [activeTab, setActiveTab] = useState<'memories' | 'search' | 'profile'>('memories');
```

### Passo 2: Ativar Tab Bar

```typescript
<BaseLayout showTabBar={true}>
  <TabBar 
    activeTab={activeTab} 
    onTabChange={setActiveTab} 
  />
</BaseLayout>
```

### Passo 3: Renderização condicional

```typescript
<MainContent>
  {activeTab === 'memories' && <MemoriesPage ... />}
  {activeTab === 'search' && <SearchPage ... />}
  {activeTab === 'profile' && <ProfilePage ... />}
</MainContent>
```

### Passo 4: Ajustar padding para Tab Bar

```typescript
// Em MemoriesPage e outras páginas
// Adicionar padding-bottom para não ficar atrás da Tab Bar
<div className="pb-20"> {/* espaço para Tab Bar */}
```

## 📝 Comentários no Código

Todos os componentes e páginas contêm comentários claros indicando:
- **FUTURO:** O que será implementado
- **Status:** Estado atual (implementado, placeholder, etc.)
- **Exemplos:** Como usar quando a navegação for ativada

## ✅ Status Atual

- ✅ Estrutura de layout criada
- ✅ Componentes reutilizáveis preparados
- ✅ Páginas placeholder criadas
- ✅ Comentários documentando uso futuro
- ✅ App visualmente idêntico (sem mudanças de UX)
- ⏳ Navegação não ativa (preparada para futuro)

## 🎯 Próximos Passos (Quando Implementar Navegação)

1. Adicionar estado de navegação no App.tsx
2. Ativar TabBar no BaseLayout
3. Implementar SearchPage com busca real
4. Implementar ProfilePage com funcionalidades
5. Adicionar animações de transição entre telas
6. Considerar React Router se necessário roteamento por URL

---

**Nota:** Esta estrutura foi criada para facilitar a implementação futura de navegação, sem alterar a UX atual. Tudo está preparado e documentado, mas não ativo.

