/**
 * Tela Você - Perfil e Configurações
 * Design iOS + Magic UI - Cards organizados e visuais
 */
import {
  User,
  LogOut,
  Bell,
  Shield,
  Palette,
  Download,
  ChevronRight,
  Sparkles,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';

interface ProfilePageProps {
  user?: { name?: string; email: string };
  onLogout?: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  const stats = [
    { label: 'Dias de uso', value: '7', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { label: 'Memórias salvas', value: '24', icon: Sparkles, color: 'from-purple-500 to-purple-600' },
    { label: 'Produtividade', value: '89%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
  ];

  const settingsGroups = [
    {
      title: 'Preferências',
      items: [
        { icon: Bell, label: 'Notificações', badge: 'Ativas' },
        { icon: Palette, label: 'Aparência', badge: 'Claro' },
      ],
    },
    {
      title: 'Privacidade',
      items: [
        { icon: Shield, label: 'Segurança' },
        { icon: Download, label: 'Exportar dados' },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header do perfil com glassmorphism */}
        <div className="relative mb-8 p-8 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* Avatar com gradiente */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                </div>
              </div>
              {/* Badge de status */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Info do usuário */}
            {user && (
              <>
                <h2 className="text-2xl font-semibold text-text-primary mb-1">
                  {user.name || 'Usuário'}
                </h2>
                <p className="text-sm text-text-secondary/70 mb-4">
                  {user.email}
                </p>
                {/* Tag Premium */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  <span className="text-xs font-semibold text-white">Membro Premium</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-5 bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-2xl font-semibold text-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-text-secondary/70 font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Seções de configurações */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-sm font-semibold text-text-secondary/60 mb-3 px-2">
                {group.title}
              </h3>
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                        itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="text-xs text-text-secondary/70 bg-gray-100 px-2 py-1 rounded-lg">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-text-secondary/40" strokeWidth={2} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Botão de logout - Destaque especial */}
        {onLogout && (
          <div className="mt-8">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100
                border border-red-200/50 rounded-2xl transition-all shadow-sm active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5 text-red-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-red-600">
                Sair da conta
              </span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary/50">
            Lumeo v1.0.0 • Feito com cuidado
          </p>
        </div>
      </div>
    </div>
  );
}
