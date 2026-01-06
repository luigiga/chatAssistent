/**
 * Página de Perfil
 * Tela completa de perfil e configurações do usuário
 */
import { useMemo } from 'react';
import {
  User,
  Edit,
  Bell,
  RefreshCw,
  Palette,
  HelpCircle,
  Heart,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import type { MemoryEntry } from '../components/MemoryTimeline';
import { ThemeToggle } from '../components/ThemeToggle';
import { AppShell } from '../components/ui/AppShell';
import { GlassCard } from '../components/ui/GlassCard';

interface ProfilePageProps {
  user?: { name?: string; email: string };
  onLogout?: () => void;
  memories?: MemoryEntry[];
}

export function ProfilePage({ user, onLogout, memories = [] }: ProfilePageProps) {
  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalMemories = memories.filter((m) => m.type === 'assistant' && m.interpretation).length;
    const totalReminders = memories.filter(
      (m) =>
        m.type === 'assistant' && m.interpretation && m.interpretation.action_type === 'reminder',
    ).length;

    return {
      memories: totalMemories,
      reminders: totalReminders,
    };
  }, [memories]);

  return (
    <AppShell maxWidth="max-w-md" className="pb-24">
      <div className="pt-6 space-y-8">
        {/* Seção de Perfil */}
        <section className="flex flex-col items-center">
          {/* Avatar com botão de edição */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center overflow-hidden border-4 border-white dark:border-surface-dark shadow-xl">
              {user?.name ? (
                <div className="w-full h-full flex items-center justify-center bg-blue-primary/10">
                  <span className="text-3xl font-bold text-blue-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <User className="w-12 h-12 text-blue-primary/60" strokeWidth={1.5} />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-surface-dark rounded-full border border-border dark:border-border-dark shadow-md text-blue-primary hover:text-blue-hover transition-colors">
              <Edit className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Nome e email */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-1">
              {user?.name || 'Usuário'}
            </h2>
            <p className="text-sm text-text-secondary/70 dark:text-text-secondary-dark/70 mb-3">
              {user?.email || ''}
            </p>
            {/* Badge Plano Pro */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <CheckCircle2
                className="w-3 h-3 text-blue-primary dark:text-blue-400 mr-1.5"
                strokeWidth={2}
              />
              <span className="text-xs font-medium text-blue-primary dark:text-blue-400">
                Plano Pro
              </span>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="grid grid-cols-2 gap-4">
          <GlassCard padding="md" className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-1">
              {stats.memories}
            </span>
            <span className="text-xs font-medium text-text-secondary/70 dark:text-text-secondary-dark/70 uppercase tracking-wide">
              Memórias
            </span>
          </GlassCard>
          <GlassCard padding="md" className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-1">
              {stats.reminders}
            </span>
            <span className="text-xs font-medium text-text-secondary/70 dark:text-text-secondary-dark/70 uppercase tracking-wide">
              Lembretes
            </span>
          </GlassCard>
        </section>

        {/* Preferências */}
        <section>
          <h3 className="text-sm font-semibold text-text-secondary/70 dark:text-text-secondary-dark/70 uppercase tracking-wider mb-3 px-1">
            Preferências
          </h3>
          <GlassCard className="overflow-hidden divide-y divide-border/50 dark:divide-border-dark/50 p-0">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 dark:text-purple-400">
                  <Bell className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Notificações
                </span>
              </div>
              <ChevronRight
                className="w-5 h-5 text-text-secondary/40 dark:text-text-secondary-dark/40 group-hover:text-blue-primary transition-colors"
                strokeWidth={2}
              />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <RefreshCw className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Sincronização
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary/70 dark:text-text-secondary-dark/70">
                  Ligado
                </span>
                <ChevronRight
                  className="w-5 h-5 text-text-secondary/40 dark:text-text-secondary-dark/40 group-hover:text-blue-primary transition-colors"
                  strokeWidth={2}
                />
              </div>
            </button>
            <div className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400">
                  <Palette className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Aparência
                </span>
              </div>
              <ThemeToggle />
            </div>
          </GlassCard>
        </section>

        {/* Suporte */}
        <section>
          <h3 className="text-sm font-semibold text-text-secondary/70 dark:text-text-secondary-dark/70 uppercase tracking-wider mb-3 px-1">
            Suporte
          </h3>
          <GlassCard className="overflow-hidden divide-y divide-border/50 dark:divide-border-dark/50 p-0">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400">
                  <HelpCircle className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Ajuda & FAQ
                </span>
              </div>
              <ChevronRight
                className="w-5 h-5 text-text-secondary/40 dark:text-text-secondary-dark/40 group-hover:text-blue-primary transition-colors"
                strokeWidth={2}
              />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 dark:text-pink-400">
                  <Heart className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Avaliar o App
                </span>
              </div>
              <ChevronRight
                className="w-5 h-5 text-text-secondary/40 dark:text-text-secondary-dark/40 group-hover:text-blue-primary transition-colors"
                strokeWidth={2}
              />
            </button>
          </GlassCard>
        </section>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors text-center"
          >
            Sair da conta
          </button>
        )}

        {/* Versão do app */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-text-secondary/50 dark:text-text-secondary-dark/50">
            Lumeo v1.0.0 (Build 1)
          </p>
        </div>
      </div>
    </AppShell>
  );
}
