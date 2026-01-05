/**
 * Página de Perfil
 * 
 * FUTURO: Tela de perfil e configurações do usuário
 * 
 * Funcionalidades planejadas:
 * - Informações do usuário
 * - Estatísticas (total de memórias, tarefas, etc.)
 * - Configurações (notificações, privacidade)
 * - Exportação de dados
 * - Logout
 * 
 * Status: Placeholder elegante
 */
import { User } from 'lucide-react';

interface ProfilePageProps {
  user?: { name?: string; email: string };
  onLogout?: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-text-secondary/60" strokeWidth={1.5} />
        </div>
        {user && (
          <h2 className="text-lg text-text-primary mb-1" style={{ fontWeight: 600 }}>
            {user.name || user.email}
          </h2>
        )}
        <p className="text-sm text-text-secondary/70 mb-6">
          Perfil e configurações em breve
        </p>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sair
          </button>
        )}
      </div>
    </div>
  );
}

