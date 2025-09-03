// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// 👉 on réutilise l'API centralisée du package shared
import { api, setTokens, loadTokensFromStorage } from '@drivn-cook/shared';

import { type User } from '../types/index.js';

type AuthState = { user: User | null; isLoading: boolean };

type Ctx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (p: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

// Types de tokens pour les réponses /auth/login et /auth/register
type StoredTokens = { accessToken: string; refreshToken: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    let mounted = true;

    // 1) Prime la mémoire interne (access/refresh) depuis localStorage
    loadTokensFromStorage();

    // 2) Tente /auth/me
    (async () => {
      try {
        const r = await api.get<User>('/auth/me'); // si 401 => intercepteur fera /auth/refresh puis rejouera
        if (mounted) setState({ user: r.data, isLoading: false });
      } catch {
        if (mounted) setState({ user: null, isLoading: false });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<StoredTokens>('/auth/login', { email, password });
    // Met à jour localStorage + in-memory + header Authorization
    setTokens(r.data);

    const me = await api.get<User>('/auth/me');
    setState({ user: me.data, isLoading: false });
  };

  const register = async (p: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const r = await api.post<StoredTokens>('/auth/register', p);
    setTokens(r.data);

    const me = await api.get<User>('/auth/me');
    setState({ user: me.data, isLoading: false });
  };

  const logout = async () => {
    try {
      // On tente une invalidation côté serveur si on a le refreshToken
      const raw = localStorage.getItem('auth_tokens');
      const tokens = raw ? (JSON.parse(raw) as Partial<StoredTokens> | null) : null;
      if (tokens?.refreshToken) {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
      }
    } finally {
      // Quoi qu'il arrive on purge côté client
      setTokens(null);
      setState({ user: null, isLoading: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider/>');
  return ctx;
};
