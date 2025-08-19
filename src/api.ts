import axios from 'axios';

// 1) Lu au build par Vite (dans chaque app qui consomme le shared)
const viteUrl: string | undefined =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? ((import.meta as any).env.VITE_API_URL as string | undefined)
    : undefined;

// 2) Fallback runtime optionnel (tu peux le garder si tu veux pouvoir override via <script>)
declare global { interface Window { __API_URL__?: string } }
const runtimeUrl = typeof window !== 'undefined' ? window.__API_URL__ : undefined;

// 3) Valeur par défaut : **/api** (marche en prod via Nginx et en dev si proxy Vite)
const BASE_URL = viteUrl ?? runtimeUrl ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // passe à true seulement si tu utilises des cookies
});

// Helper pour changer dynamiquement si besoin
export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
}

// tokens...
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  accessToken = tokens?.accessToken ?? null;
  refreshToken = tokens?.refreshToken ?? null;
  if (tokens) localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  else localStorage.removeItem('auth_tokens');
}

export function loadTokensFromStorage() {
  const raw = localStorage.getItem('auth_tokens');
  if (raw) {
    const t = JSON.parse(raw);
    accessToken = t.accessToken;
    refreshToken = t.refreshToken;
  }
}

// interceptors
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  r => r,
  async (error) => {
    const original: any = error.config || {};
    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true;
      if (isRefreshing) {
        await new Promise<void>((res) => queue.push(res));
      } else {
        isRefreshing = true;
        try {
          const resp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          setTokens(resp.data);
          queue.forEach((fn) => fn());
        } catch (e) {
          setTokens(null);
          queue.forEach((fn) => fn());
          throw e;
        } finally {
          queue = [];
          isRefreshing = false;
        }
      }
      return api(original);
    }
    throw error;
  }
);
