// shared/src/api.ts
import axios, { AxiosError } from 'axios';

/** -----------------------------
 *  Base URL (vite + runtime + fallback)
 *  ----------------------------- */
const viteUrl: string | undefined =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? ((import.meta as any).env.VITE_API_URL as string | undefined)
    : undefined;

declare global { interface Window { __API_URL__?: string } }
const runtimeUrl = typeof window !== 'undefined' ? window.__API_URL__ : undefined;

const BASE_URL = viteUrl ?? runtimeUrl ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  // timeout: 20000, // optionnel: timeouts réseau
});

/** -----------------------------
 *  Changer dynamiquement la base URL
 *  ----------------------------- */
export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
}

/** -----------------------------
 *  Tokens (in-memory + localStorage)
 *  ----------------------------- */
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
    try {
      const t = JSON.parse(raw);
      accessToken = t.accessToken ?? null;
      refreshToken = t.refreshToken ?? null;
    } catch {
      // ignore
    }
  }
}

/** -----------------------------
 *  Notificateur d'erreurs (injecté par les apps)
 *  ----------------------------- */
export type NormalizedError = {
  status?: number;
  code?: string;
  title: string;
  message: string;
  details?: string[];    // pour les erreurs zod, liste des messages par champ
  raw?: unknown;         // garde l’original si besoin de debug
};

let errorNotifier: (err: NormalizedError) => void = () => {};
export function setErrorNotifier(fn: (err: NormalizedError) => void) {
  errorNotifier = fn;
}

/** -----------------------------
 *  Normalisation des erreurs
 *  Gère:
 *   - réseau / timeout
 *   - 4xx / 5xx avec message
 *   - erreurs Zod: .issues[] ou .errors (flatten)
 *  ----------------------------- */
function normalizeAxiosError(error: any): NormalizedError {
  // AxiosError typé
  const ax = error as AxiosError<any>;
  // 1) Erreurs réseau hors réponse (timeout, DNS, offline…)
  if (ax.isAxiosError && !ax.response) {
    return {
      title: 'Problème réseau',
      message: ax.message || 'Impossible de joindre le serveur.',
      raw: error,
    };
  }

  const status = ax.response?.status;
  const data = ax.response?.data;

  // 2) Tentatives d'extraction d'un message "simple"
  const messageFromData =
    (data && (data.message || data.error || data.msg)) ||
    (typeof data === 'string' ? data : undefined);

  // 3) Détection Zod (deux formats fréquents)
  //    a) ZodError standard: { issues: [{ path, message }, ...] }
  if (data?.issues && Array.isArray(data.issues)) {
    const details = data.issues.map((it: any) => {
      const path = Array.isArray(it.path) ? it.path.join('.') : String(it.path ?? '');
      return path ? `${path}: ${it.message}` : it.message;
    });
    return {
      status,
      title: 'Validation invalide',
      message: 'Certains champs sont invalides.',
      details,
      raw: data,
    };
  }

  //    b) zod .flatten(): { errors, fieldErrors: { field: [msg, ...] } }
  if (data?.errors || data?.fieldErrors) {
    const fieldErrors = data.fieldErrors ?? data.errors;
    if (fieldErrors && typeof fieldErrors === 'object') {
      const details: string[] = [];
      for (const k of Object.keys(fieldErrors)) {
        const arr = fieldErrors[k];
        if (Array.isArray(arr) && arr.length) {
          details.push(`${k}: ${arr.join(', ')}`);
        }
      }
      if (details.length) {
        return {
          status,
          title: 'Validation invalide',
          message: 'Certains champs sont invalides.',
          details,
          raw: data,
        };
      }
    }
  }

  // 4) Sinon, mapping basique selon le status
  const fallbackTitle =
    status && status >= 500 ? 'Erreur serveur'
    : status && status === 401 ? 'Authentification requise'
    : status && status === 403 ? 'Accès interdit'
    : status && status === 404 ? 'Ressource introuvable'
    : 'Erreur';

  return {
    status,
    title: fallbackTitle,
    message: messageFromData || `Erreur ${status ?? ''}`.trim(),
    raw: data ?? error,
  };
}

/** -----------------------------
 *  Interceptors
 *  ----------------------------- */
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
    const status = error?.response?.status;

    // 401 → refresh token
    if (status === 401 && !original._retry && refreshToken) {
      original._retry = true;

      if (isRefreshing) {
        await new Promise<void>((res) => queue.push(res));
      } else {
        isRefreshing = true;
        try {
          const resp = await axios.post(`${api.defaults.baseURL || BASE_URL}/auth/refresh`, { refreshToken });
          setTokens(resp.data);
          queue.forEach((fn) => fn());
        } catch (e) {
          setTokens(null);
          queue.forEach((fn) => fn());
          // notifier l’erreur de refresh aussi
          errorNotifier(normalizeAxiosError(e));
          throw e;
        } finally {
          queue = [];
          isRefreshing = false;
        }
      }
      return api(original);
    }

    // Notifier toutes les autres erreurs
    try {
      errorNotifier(normalizeAxiosError(error));
    } catch {
      // ne jamais casser la promise pour une notif
    }

    // Laisse l’app gérer ensuite (catch côté appelant si besoin)
    throw error;
  }
);
