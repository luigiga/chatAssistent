/**
 * Componente principal da aplicação - Interface de Memória Pessoal
 *
 * ESTRUTURA PREPARADA PARA NAVEGAÇÃO FUTURA:
 * - BaseLayout: Layout base com suporte para Tab Bar
 * - MainContent: Container para conteúdo da tela atual
 * - TabBar: Componente de navegação (estrutura preparada, não ativo)
 *   - 3 abas futuras: Capturar, Memórias, Você
 *   - Para ativar: passar showTabBar={true} no BaseLayout
 *
 * FUTURO: Navegação entre telas (3 abas):
 * - Capturar: Campo principal para registrar pensamentos (tela atual)
 * - Memórias: Timeline completa de todas as memórias registradas
 * - Você: Perfil, configurações e estatísticas do usuário
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BaseLayout } from './components/layout/BaseLayout';
import { MainContent } from './components/layout/MainContent';
import { AppHeader } from './components/layout/AppHeader';
import { MemoriesPage } from './pages/MemoriesPage';
import { MemoriesListPage } from './pages/MemoriesListPage';
import { ProfilePage } from './pages/ProfilePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { PageTransition } from './components/ui/PageTransition';
import { GlobalSearch } from './components/GlobalSearch';
import { MemoryDetailSheet } from './components/memories/MemoryDetailSheet';
import type { MemoryEntry, ExtendedMemoryEntry } from './components/MemoryTimeline';
import type { TabId } from './components/navigation/TabBar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import {
  interpretText,
  type MemoryInterpretationResponse,
  confirmInteraction,
  rejectInteraction,
  listMemories,
  completeReminder,
  setMemoryCategory,
} from './services/api';

function MemoryInterface() {
  const { accessToken, user, logout: handleLogout, refreshAccessToken } = useAuth();
  // Separar memórias do backend (salvas) das memórias locais (em processo)
  const [backendMemories, setBackendMemories] = useState<MemoryEntry[]>([]);
  const [localMemories, setLocalMemories] = useState<MemoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmingIds, setConfirmingIds] = useState<Set<string>>(new Set());
  const [highlightInput, setHighlightInput] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('capture');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<ExtendedMemoryEntry | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  // Carregar memórias do backend quando o app abre (não depende da aba ativa)
  useEffect(() => {
    const fetchBackendMemories = async () => {
      if (!accessToken) {
        return;
      }

      try {
        const backendData = await listMemories(accessToken, 'all', refreshAccessToken);
        
        // Converter MemoryResponse para MemoryEntry
        const convertedMemories: MemoryEntry[] = backendData.map((mem) => ({
          id: mem.id,
          type: 'assistant' as const,
          content: mem.content,
          interpretation: mem.interpretation,
          timestamp: new Date(mem.timestamp),
          metadata: mem.metadata
            ? {
                completed: mem.metadata.completed,
                completedAt: mem.metadata.completedAt ? new Date(mem.metadata.completedAt) : undefined,
                isFavorite: mem.metadata.isFavorite,
                isPinned: mem.metadata.isPinned,
                category: mem.metadata.category?.id || undefined,
              }
            : undefined,
        }));

        setBackendMemories(convertedMemories);
      } catch (error) {
        console.error('Erro ao buscar memórias:', error);
        // Não mostrar erro ao usuário - interface silenciosa
      }
    };

    fetchBackendMemories();
  }, [accessToken, refreshAccessToken]);

  // Memórias para a tela de captura: apenas locais (user, loading, não confirmadas)
  const captureMemories = useMemo(() => {
    return localMemories.filter(
      (m) => 
        m.type === 'user' || 
        m.type === 'loading' || 
        (m.type === 'assistant' && m.needsConfirmation === true)
    );
  }, [localMemories]);

  // Memórias para a tela de memórias: backend + locais (removendo duplicatas)
  const allMemories = useMemo(() => {
    const combined = [...backendMemories, ...localMemories];
    return Array.from(new Map(combined.map((m) => [m.id, m])).values());
  }, [backendMemories, localMemories]);

  const handleSave = useCallback(
    async (text: string) => {
      if (!accessToken) {
        return;
      }

      // Adicionar entrada do usuário
      const userInput: MemoryEntry = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: text,
        timestamp: new Date(),
      };

      setLocalMemories((prev) => [...prev, userInput]);
      setIsLoading(true);

      // Adicionar indicador de processamento
      const processingIndicator: MemoryEntry = {
        id: `loading-${Date.now()}`,
        type: 'loading',
        timestamp: new Date(),
      };

      setLocalMemories((prev) => [...prev, processingIndicator]);

      try {
        // Chamar API com token de autenticação e função de refresh
        const response: MemoryInterpretationResponse = await interpretText(
          text,
          accessToken,
          refreshAccessToken,
        );

        // Remover indicador de processamento e adicionar resposta do assistente
        setLocalMemories((prev) => {
          const withoutLoading = prev.filter((msg) => msg.id !== processingIndicator.id);

          // Se a IA não conseguiu classificar (unknown), tratar como nota genérica
          let interpretation = response.interpretation;
          if (interpretation.action_type === 'unknown') {
            interpretation = {
              ...interpretation,
              action_type: 'note',
              note: {
                content: text, // Usar o texto original do usuário
              },
              needs_confirmation: false, // Sempre salvar automaticamente
            };
          }

          const savedAction: MemoryEntry = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            interpretation,
            interactionId: response.interactionId,
            needsConfirmation: interpretation.needs_confirmation,
            timestamp: new Date(),
          };

          // Destacar input após criação de memória
          setHighlightInput(true);
          setTimeout(() => setHighlightInput(false), 100);

          return [...withoutLoading, savedAction];
        });
      } catch (error) {
        // Remover indicador de processamento
        setLocalMemories((prev) => {
          const withoutLoading = prev.filter((msg) => msg.id !== processingIndicator.id);

          const errorMessage =
            error instanceof Error ? error.message : 'Não foi possível processar';

          // Se o erro for de sessão expirada, fazer logout após um delay
          if (errorMessage.includes('Sessão expirada') || errorMessage.includes('login')) {
            setTimeout(() => {
              handleLogout();
            }, 2000);
            return withoutLoading;
          }

          // Em caso de erro, salvar como nota genérica ao invés de mostrar erro
          // O usuário nunca deve sentir que "falou errado"
          const savedAction: MemoryEntry = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            interpretation: {
              needs_confirmation: false,
              action_type: 'note',
              note: {
                content: text, // Salvar o texto original do usuário
              },
            },
            timestamp: new Date(),
          };
          return [...withoutLoading, savedAction];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshAccessToken, handleLogout],
  );

  const handleConfirm = useCallback(
    async (interactionId: string, categoryId?: string) => {
      if (!accessToken) return;

      setConfirmingIds((prev) => new Set(prev).add(interactionId));

      try {
        await confirmInteraction(accessToken, interactionId, refreshAccessToken);

        // Encontrar a memória para obter o tipo (buscar em localMemories primeiro, depois em allMemories)
        const memory = localMemories.find((m) => m.interactionId === interactionId) || 
                       allMemories.find((m) => m.interactionId === interactionId);
        const actionType = memory?.interpretation?.action_type;

        // Se categoria foi selecionada e temos um tipo válido, salvar categoria
        if (categoryId && actionType && actionType !== 'unknown' && memory?.id) {
          try {
            await setMemoryCategory(
              accessToken,
              memory.id,
              actionType as 'task' | 'note' | 'reminder',
              categoryId,
              refreshAccessToken,
            );
          } catch (error) {
            // Erro ao salvar categoria não deve quebrar o fluxo
            console.error('Erro ao salvar categoria:', error);
          }
        }

        // Atualizar memória local para remover botões de confirmação
        setLocalMemories((prev) =>
          prev.map((memory) => {
            if (memory.interactionId === interactionId) {
              return {
                ...memory,
                needsConfirmation: false,
                interpretation: {
                  ...memory.interpretation!,
                  needs_confirmation: false,
                },
              };
            }
            return memory;
          }),
        );

        // Refetch do backend para atualizar memórias salvas
        // A memória confirmada agora está no backend
        try {
          const backendData = await listMemories(accessToken, 'all', refreshAccessToken);
          const convertedMemories: MemoryEntry[] = backendData.map((mem) => ({
            id: mem.id,
            type: 'assistant' as const,
            content: mem.content,
            interpretation: mem.interpretation,
            timestamp: new Date(mem.timestamp),
            metadata: mem.metadata
              ? {
                  completed: mem.metadata.completed,
                  completedAt: mem.metadata.completedAt ? new Date(mem.metadata.completedAt) : undefined,
                  isFavorite: mem.metadata.isFavorite,
                  isPinned: mem.metadata.isPinned,
                  category: mem.metadata.category?.id || undefined,
                }
              : undefined,
          }));
          setBackendMemories(convertedMemories);
          
          // Remover da localMemories se já estiver no backend
          const backendIds = new Set(backendData.map((bm) => bm.id));
          setLocalMemories((prev) =>
            prev.filter((m) => {
              // Manter user, loading, e memórias não salvas ainda
              if (m.type === 'user' || m.type === 'loading') return true;
              // Remover se já está no backend
              return !backendIds.has(m.id);
            })
          );
        } catch (error) {
          console.error('Erro ao atualizar memórias após confirmação:', error);
        }

        // Não adicionar mensagem extra - o cartão já mostra "Registrado"
        // Interface permanece silenciosa e confiante
      } catch (error) {
        // Em caso de erro na confirmação, apenas remover o estado de loading
        // Não mostrar erro ao usuário - a interface permanece silenciosa
        console.error('Erro ao confirmar interação:', error);
      } finally {
        setConfirmingIds((prev) => {
          const next = new Set(prev);
          next.delete(interactionId);
          return next;
        });
      }
    },
    [accessToken, refreshAccessToken, localMemories, allMemories],
  );

  const handleCompleteReminder = useCallback(
    async (reminderId: string) => {
      if (!accessToken) return;

      try {
        await completeReminder(accessToken, reminderId);
        
        // Atualizar memória do backend para marcar como concluída
        setBackendMemories((prev) =>
          prev.map((memory) => {
            if (memory.id === reminderId) {
              return {
                ...memory,
                metadata: {
                  ...memory.metadata,
                  completed: true,
                  completedAt: new Date(),
                },
              };
            }
            return memory;
          }),
        );

        // Refetch do backend para garantir sincronização
        try {
          const backendData = await listMemories(accessToken, 'all', refreshAccessToken);
          const convertedMemories: MemoryEntry[] = backendData.map((mem) => ({
            id: mem.id,
            type: 'assistant' as const,
            content: mem.content,
            interpretation: mem.interpretation,
            timestamp: new Date(mem.timestamp),
            metadata: mem.metadata
              ? {
                  completed: mem.metadata.completed,
                  completedAt: mem.metadata.completedAt ? new Date(mem.metadata.completedAt) : undefined,
                  isFavorite: mem.metadata.isFavorite,
                  isPinned: mem.metadata.isPinned,
                  category: mem.metadata.category?.id || undefined,
                }
              : undefined,
          }));
          setBackendMemories(convertedMemories);
        } catch (error) {
          console.error('Erro ao atualizar memórias após completar lembrete:', error);
        }
      } catch (error) {
        console.error('Erro ao completar lembrete:', error);
      }
    },
    [accessToken, refreshAccessToken],
  );

  const handleReject = useCallback(
    async (interactionId: string) => {
      if (!accessToken) return;

      setConfirmingIds((prev) => new Set(prev).add(interactionId));

      try {
        await rejectInteraction(accessToken, interactionId, refreshAccessToken);

        // Atualizar memória para remover botões de confirmação
        setMemories((prev) =>
          prev.map((memory) => {
            if (memory.interactionId === interactionId) {
              return {
                ...memory,
                needsConfirmation: false,
                interpretation: {
                  ...memory.interpretation!,
                  needs_confirmation: false,
                },
              };
            }
            return memory;
          }),
        );

        // Não adicionar mensagem de rejeição
        // A remoção dos botões já indica que foi processado
        // Interface permanece silenciosa
      } catch (error) {
        // Em caso de erro na rejeição, apenas remover o estado de loading
        // Não mostrar erro ao usuário - a interface permanece silenciosa
        console.error('Erro ao rejeitar interação:', error);
      } finally {
        setConfirmingIds((prev) => {
          const next = new Set(prev);
          next.delete(interactionId);
          return next;
        });
      }
    },
    [accessToken, refreshAccessToken],
  );

  // Títulos dinâmicos baseados na tab ativa
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'capture':
        return 'Lumeo';
      case 'memories':
        return undefined; // Header neutro na aba Memórias
      case 'profile':
        return 'Você';
      default:
        return 'Lumeo';
    }
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'capture':
        return 'Assistente de memória pessoal';
      case 'memories':
        return undefined; // Header neutro na aba Memórias
      case 'profile':
        return undefined;
      default:
        return 'Assistente de memória pessoal';
    }
  };

  return (
    <BaseLayout showTabBar={true} activeTab={activeTab} onTabChange={handleTabChange}>
      {/* Header reutilizável com título dinâmico */}
      <AppHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        actions={
          activeTab === 'profile' ? undefined : (
            <>
              {user && (
                <span className="text-sm text-text-secondary">{user.name || user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Sair
              </button>
            </>
          )
        }
      />

      {/* Renderização condicional baseada em tab ativa com transição suave */}
      <MainContent>
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'capture' && (
            <PageTransition key="capture">
              <MemoriesPage
                memories={captureMemories}
                onSave={handleSave}
                onConfirm={handleConfirm}
                onReject={handleReject}
                confirmingIds={confirmingIds}
                isLoading={isLoading}
                highlightInput={highlightInput}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </PageTransition>
          )}
          {activeTab === 'memories' && (
            <PageTransition key="memories">
              <MemoriesListPage 
                memories={allMemories} 
                onCompleteReminder={handleCompleteReminder}
                onMemoryUpdate={async () => {
                  // Refetch memories após toggle
                  if (accessToken) {
                    try {
                      const backendData = await listMemories(accessToken, 'all', refreshAccessToken);
                      const convertedMemories: MemoryEntry[] = backendData.map((mem) => ({
                        id: mem.id,
                        type: 'assistant' as const,
                        content: mem.content,
                        interpretation: mem.interpretation,
                        timestamp: new Date(mem.timestamp),
                        metadata: mem.metadata
                          ? {
                              completed: mem.metadata.completed,
                              completedAt: mem.metadata.completedAt ? new Date(mem.metadata.completedAt) : undefined,
                              isFavorite: mem.metadata.isFavorite,
                              isPinned: mem.metadata.isPinned,
                              category: mem.metadata.category?.id || undefined,
                            }
                          : undefined,
                      }));
                      
                      setBackendMemories(convertedMemories);
                    } catch (error) {
                      console.error('Erro ao atualizar memórias:', error);
                    }
                  }
                }}
              />
            </PageTransition>
          )}
          {activeTab === 'profile' && !showCategories && (
            <PageTransition key="profile">
              <ProfilePage
                user={user || undefined}
                onLogout={handleLogout}
                memories={allMemories}
                onNavigateToCategories={() => setShowCategories(true)}
              />
            </PageTransition>
          )}
          {activeTab === 'profile' && showCategories && (
            <PageTransition key="categories">
              <CategoriesPage onBack={() => setShowCategories(false)} />
            </PageTransition>
          )}
        </AnimatePresence>
      </MainContent>

      {/* Global Search */}
      <GlobalSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectMemory={(memory) => {
          setSelectedMemory(memory as ExtendedMemoryEntry);
          setDetailSheetOpen(true);
        }}
      />

      {/* Memory Detail Sheet (para busca) */}
      {selectedMemory && (
        <MemoryDetailSheet
          memory={selectedMemory}
          open={detailSheetOpen}
          onOpenChange={(open) => {
            setDetailSheetOpen(open);
            if (!open) {
              setSelectedMemory(null);
            }
          }}
          onUpdate={async (memoryId, updates) => {
            // Atualizar memória do backend se necessário
            // Refetch para garantir sincronização
            if (accessToken) {
              try {
                const backendData = await listMemories(accessToken, 'all', refreshAccessToken);
                const convertedMemories: MemoryEntry[] = backendData.map((mem) => ({
                  id: mem.id,
                  type: 'assistant' as const,
                  content: mem.content,
                  interpretation: mem.interpretation,
                  timestamp: new Date(mem.timestamp),
                  metadata: mem.metadata
                    ? {
                        completed: mem.metadata.completed,
                        completedAt: mem.metadata.completedAt ? new Date(mem.metadata.completedAt) : undefined,
                        isFavorite: mem.metadata.isFavorite,
                        isPinned: mem.metadata.isPinned,
                        category: mem.metadata.category?.id || undefined,
                      }
                    : undefined,
                }));
                setBackendMemories(convertedMemories);
              } catch (error) {
                console.error('Erro ao atualizar memórias:', error);
              }
            }
          }}
        />
      )}
    </BaseLayout>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary text-sm">Carregando</div>
      </div>
    );
  }

  return isAuthenticated ? <MemoryInterface /> : <AuthScreen />;
}

function AppWithProvider() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWithProvider;
