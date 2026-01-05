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
import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BaseLayout } from './components/layout/BaseLayout';
import { MainContent } from './components/layout/MainContent';
import { AppHeader } from './components/layout/AppHeader';
import { MemoriesPage } from './pages/MemoriesPage';
import { MemoriesListPage } from './pages/MemoriesListPage';
import { ProfilePage } from './pages/ProfilePage';
import type { MemoryEntry } from './components/MemoryTimeline';
import type { TabId } from './components/navigation/TabBar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import {
  interpretText,
  type MemoryInterpretationResponse,
  confirmInteraction,
  rejectInteraction,
} from './services/api';

function MemoryInterface() {
  const { accessToken, user, logout: handleLogout, refreshAccessToken } = useAuth();
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmingIds, setConfirmingIds] = useState<Set<string>>(new Set());
  const [highlightInput, setHighlightInput] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('capture');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const handleSave = useCallback(async (text: string) => {
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

    setMemories((prev) => [...prev, userInput]);
    setIsLoading(true);

    // Adicionar indicador de processamento
    const processingIndicator: MemoryEntry = {
      id: `loading-${Date.now()}`,
      type: 'loading',
      timestamp: new Date(),
    };

    setMemories((prev) => [...prev, processingIndicator]);

    try {
      // Chamar API com token de autenticação e função de refresh
      const response: MemoryInterpretationResponse = await interpretText(
        text,
        accessToken,
        refreshAccessToken,
      );

      // Remover indicador de processamento e adicionar resposta do assistente
      setMemories((prev) => {
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
      setMemories((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== processingIndicator.id);
        
        const errorMessage =
          error instanceof Error ? error.message : 'Não foi possível processar';

        // Se o erro for de sessão expirada, fazer logout após um delay
        if (
          errorMessage.includes('Sessão expirada') ||
          errorMessage.includes('login')
        ) {
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
  }, [accessToken, refreshAccessToken, handleLogout]);

  const handleConfirm = useCallback(
    async (interactionId: string) => {
      if (!accessToken) return;

      setConfirmingIds((prev) => new Set(prev).add(interactionId));

      try {
        await confirmInteraction(
          accessToken,
          interactionId,
          refreshAccessToken,
        );

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
        return 'Memórias';
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
        return 'Todas as suas memórias';
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
                <span className="text-sm text-text-secondary">
                  {user.name || user.email}
                </span>
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

      {/* Renderização condicional baseada em tab ativa */}
      <MainContent>
        {activeTab === 'capture' && (
          <MemoriesPage
            memories={memories}
            onSave={handleSave}
            onConfirm={handleConfirm}
            onReject={handleReject}
            confirmingIds={confirmingIds}
            isLoading={isLoading}
            highlightInput={highlightInput}
          />
        )}
        {activeTab === 'memories' && (
          <MemoriesListPage memories={memories} />
        )}
        {activeTab === 'profile' && (
          <ProfilePage user={user || undefined} onLogout={handleLogout} />
        )}
      </MainContent>
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
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProvider;
