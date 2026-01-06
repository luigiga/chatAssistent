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
import { motion } from 'framer-motion';
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
    <nav className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-4xl mx-auto px-4 pb-safe">
        <div className="rounded-t-3xl bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-t border-border/10 dark:border-border-dark/10 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-primary/10 text-blue-primary'
                      : 'text-text-secondary/70 dark:text-text-secondary-dark/70 hover:text-text-secondary dark:hover:text-text-secondary-dark'
                  }`}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <tab.Icon
                    className={`w-5 h-5 mb-0.5 transition-all duration-200 ${isActive ? 'scale-105' : ''}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-xs" style={{ fontWeight: isActive ? 500 : 400 }}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
