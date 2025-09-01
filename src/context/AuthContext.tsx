// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setTokens, loadTokensFromStorage } from '../api.js';

type User = { id: string; email: string; role: 'USER' | 'ADMIN'; firstName?: string; lastName?: string };

type AuthState = { user: User | null; isLoading: boolean };
type Ctx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (p: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

// --- Type guard pour les tokens renvoyés par loadTokensFromStorage (dont le type n'est pas garanti) ---
type AuthTokensLoose = { accessToken?: string; refreshToken?: string } | null | undefined;
function hasTokens(x: unknown): x is { accessToken?: string; refreshToken?: string } {
  return !!x && (typeof (x as any).accessToken === 'string' || typeof (x as any).refreshToken === 'string');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    // 1) Charger les tokens (sans supposer leur forme)
    const raw: AuthTokensLoose = loadTokensFromStorage() as AuthTokensLoose;

    // 2) Si pas de tokens valides -> ne pas appeler /auth/me (évite le 401 au boot)
    if (!hasTokens(raw)) {
      setState({ user: null, isLoading: false });
      return;
    }

    // 3) Sinon, on tente /auth/me et on ignore silencieusement le 401
    (async () => {
      try {
        const r = await api.get('/auth/me');
        setState({ user: r.data, isLoading: false });
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error(err);
        }
        setState({ user: null, isLoading: false });
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post('/auth/login', { email, password });
    setTokens(r.data); // met les headers axios + stocke localStorage
    const me = await api.get('/auth/me');
    setState({ user: me.data, isLoading: false });
  };

  const register = async (p: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const r = await api.post('/auth/register', p);
    setTokens(r.data);
    const me = await api.get('/auth/me');
    setState({ user: me.data, isLoading: false });
  };

  const logout = async () => {
    try {
      const raw = localStorage.getItem('auth_tokens');
      const tokens = raw ? JSON.parse(raw) : null;
      if (tokens?.refreshToken) await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
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
