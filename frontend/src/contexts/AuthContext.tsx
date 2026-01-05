/**
 * Contexto de autenticação
 * Gerencia estado global de autenticação e tokens
 */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login, register, refreshToken, logout, type AuthResponse } from '../services/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'lumeo_access_token';
const REFRESH_TOKEN_KEY = 'lumeo_refresh_token';
const USER_KEY = 'lumeo_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado inicial do localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedAccessToken && storedUser) {
      try {
        setAccessToken(storedAccessToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Se houver erro ao parsear, limpar storage
        clearStorage();
      }
    }

    // Tentar refresh se tiver refresh token mas não access token
    if (storedRefreshToken && !storedAccessToken) {
      handleRefreshToken(storedRefreshToken).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const clearStorage = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setAccessToken(null);
  };

  const handleLogin = async (email: string, password: string) => {
    const response: AuthResponse = await login(email, password);
    
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    
    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const response: AuthResponse = await register(name, email, password);
    
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    
    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const handleLogout = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (storedRefreshToken) {
      try {
        await logout(storedRefreshToken);
      } catch (error) {
        // Continuar com logout mesmo se a chamada falhar
        console.error('Erro ao fazer logout no servidor:', error);
      }
    }
    
    clearStorage();
  };

  const handleRefreshToken = async (refreshTokenValue: string): Promise<void> => {
    try {
      const response = await refreshToken(refreshTokenValue);
      
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      
      setAccessToken(response.accessToken);
    } catch (error) {
      // Se refresh falhar, fazer logout
      clearStorage();
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      throw new Error('Refresh token não encontrado');
    }
    await handleRefreshToken(storedRefreshToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

