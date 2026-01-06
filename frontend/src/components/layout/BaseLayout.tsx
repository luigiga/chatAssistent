/**
 * Layout base do Lumeo
 * Estrutura preparada para futura navegação com Tab Bar
 * 
 * FUTURO: Este layout suportará:
 * - Tab Bar na parte inferior (iOS-like) com 3 abas:
 *   - Capturar: Campo principal para registrar pensamentos
 *   - Memórias: Timeline de todas as memórias registradas
 *   - Você: Perfil, configurações e estatísticas
 * - Navegação entre telas baseada em estado ou roteamento
 * - Safe area para dispositivos com notch
 */
import type { ReactNode } from 'react';
import { TabBar, type TabId } from '../navigation/TabBar';

interface BaseLayoutProps {
  children: ReactNode;
  showTabBar?: boolean; // FUTURO: Controlar visibilidade da Tab Bar
  activeTab?: TabId; // FUTURO: Tab ativa quando navegação estiver implementada
  onTabChange?: (tab: TabId) => void; // FUTURO: Handler para mudança de tab
}

export function BaseLayout({ 
  children, 
  showTabBar = false,
  activeTab = 'capture',
  onTabChange,
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark">
      {/* Conteúdo principal */}
      <main className={`flex-1 flex flex-col overflow-hidden ${showTabBar ? 'pb-16' : ''}`}>
        {children}
      </main>

      {/* Tab Bar de navegação (iOS-like)
          Não renderizar na tela de Capturar, pois está integrado no container do input
      */}
      {showTabBar && activeTab !== 'capture' && (
        <TabBar activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  );
}

