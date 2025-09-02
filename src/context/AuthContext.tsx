// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setTokens, loadTokensFromStorage } from '../api.js';
import { type User } from '../types/index.js';

type AuthState = { user: User | null; isLoading: boolean };

type Ctx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (p: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

// --- Token guards stricts ---
type StoredTokens = { accessToken: string; refreshToken: string };
type StoredTokensLoose = { accessToken?: string; refreshToken?: string } | null | undefined;

function isStoredTokens(x: unknown): x is StoredTokens {
  return !!x && typeof (x as any).accessToken === 'string' && typeof (x as any).refreshToken === 'string';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const raw = loadTokensFromStorage() as StoredTokensLoose;

    // Pas de paire complète de tokens → pas d'appel /auth/me
    if (!isStoredTokens(raw)) {
      setState({ user: null, isLoading: false });
      return;
    }

    // ✅ Prime Axios avec les tokens avant /auth/me
    setTokens(raw);

    (async () => {
      try {
        const r = await api.get<User>('/auth/me');
        setState({ user: r.data, isLoading: false });
      } catch (err: any) {
        if (err?.response?.status !== 401) console.error(err);
        setState({ user: null, isLoading: false });
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<StoredTokens>('/auth/login', { email, password });
    setTokens(r.data); // met les headers axios + stocke localStorage
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
      const raw = localStorage.getItem('auth_tokens');
      const tokens = raw ? JSON.parse(raw) as StoredTokensLoose : null;
      if (tokens && typeof tokens.refreshToken === 'string') {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
      }
    } finally {
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
