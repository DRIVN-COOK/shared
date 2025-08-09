import axios from 'axios';

// 1) Essai env Vite (sera résolu par le bundler de l'app consommatrice)
const viteUrl =
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env &&
  ((import.meta as any).env.VITE_API_URL as string | undefined);

// 2) Fallback global (peut être injecté par une balise <script> avant le bundle)
declare global {
  interface Window { __API_URL__?: string; }
}
const globalUrl = typeof window !== 'undefined' ? window.__API_URL__ : undefined;

// 3) Valeur par défaut (dev local)
let BASE_URL = viteUrl || globalUrl || 'http://localhost:3000';

// Permet à chaque app de définir explicitement l'URL (ex: depuis config.js)
export function setApiBaseUrl(url: string) {
  BASE_URL = url;
  api.defaults.baseURL = url;
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

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
