/**
 * Tab Bar de navegação (iOS-like)
 * 
 * FUTURO: Componente de navegação principal do Lumeo
 * 
 * Estrutura preparada para 3 abas:
 * - Capturar: Campo principal para registrar pensamentos (tela atual)
 * - Memórias: Timeline de todas as memórias registradas
 * - Você: Perfil, configurações e estatísticas do usuário
 * 
 * Status: Estrutura preparada, não renderizada atualmente
 * Para ativar: passar showTabBar={true} no BaseLayout
 */
import { PlusCircle, FileText, User } from 'lucide-react';

export type TabId = 'capture' | 'memories' | 'profile';

interface TabBarProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

export function TabBar({ activeTab = 'capture', onTabChange }: TabBarProps) {
  // FUTURO: Implementar navegação real
  // Quando ativado, este componente será renderizado no BaseLayout
  // e controlará a navegação entre as 3 telas principais
  
  const tabs: Array<{ id: TabId; label: string; Icon: typeof PlusCircle }> = [
    { id: 'capture', label: 'Capturar', Icon: PlusCircle },
    { id: 'memories', label: 'Memórias', Icon: FileText },
    { id: 'profile', label: 'Você', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-sm border-t border-border/50 z-20 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200 ${
                  isActive
                    ? 'text-blue-primary'
                    : 'text-text-secondary/70 hover:text-text-secondary'
                }`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <tab.Icon 
                  className={`w-5 h-5 mb-0.5 transition-all duration-200 ${isActive ? 'scale-105' : ''}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className="text-xs" style={{ fontWeight: isActive ? 600 : 400 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

