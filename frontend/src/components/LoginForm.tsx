/**
 * Componente de formulário de login
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Credenciais inválidas',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
            Lumeo
          </h2>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Entre para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-primary text-white py-3 rounded-xl font-medium hover:bg-blue-hover transition-colors disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Continuar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-primary hover:text-blue-hover font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

