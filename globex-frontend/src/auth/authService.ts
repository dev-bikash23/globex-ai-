// Auth service — all API calls related to authentication
// Access tokens stored in memory only (never localStorage for security)
// Refresh tokens stored in localStorage (acceptable tradeoff for SPA without httpOnly cookies)

import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from './authTypes';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// In-memory access token — never stored in localStorage
let inMemoryAccessToken: string | null = null;

export const authService = {
  // ── Token management ───────────────────────────────────────────────────
  getAccessToken: () => inMemoryAccessToken,
  setAccessToken: (token: string | null) => { inMemoryAccessToken = token; },

  getRefreshToken: () => localStorage.getItem('globex_refresh_token'),
  setRefreshToken: (token: string | null) => {
    if (token) localStorage.setItem('globex_refresh_token', token);
    else localStorage.removeItem('globex_refresh_token');
  },

  clearTokens: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem('globex_refresh_token');
  },

  // ── Register ───────────────────────────────────────────────────────────
  register: async (data: RegisterRequest): Promise<ApiResponse<{ id: string; email: string }>> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── Login ──────────────────────────────────────────────────────────────
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<AuthResponse> = await res.json();
    if (json.success && json.data) {
      inMemoryAccessToken = json.data.accessToken;
      authService.setRefreshToken(json.data.refreshToken);
    }
    return json;
  },

  // ── Refresh ────────────────────────────────────────────────────────────
  refresh: async (): Promise<ApiResponse<AuthResponse>> => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) return { success: false, timestamp: new Date().toISOString() };

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json: ApiResponse<AuthResponse> = await res.json();
    if (json.success && json.data) {
      inMemoryAccessToken = json.data.accessToken;
      authService.setRefreshToken(json.data.refreshToken);
    }
    return json;
  },

  // ── Logout ─────────────────────────────────────────────────────────────
  logout: async (): Promise<void> => {
    const refreshToken = authService.getRefreshToken();
    const accessToken  = inMemoryAccessToken;
    authService.clearTokens();
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Best-effort logout — tokens already cleared locally
    }
  },

  // ── Forgot password ────────────────────────────────────────────────────
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // ── Reset password ─────────────────────────────────────────────────────
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return res.json();
  },

  // ── Authenticated fetch (auto-refresh on 401) ──────────────────────────
  authFetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = inMemoryAccessToken;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.status === 401) {
      // Attempt silent refresh
      const refreshed = await authService.refresh();
      if (refreshed.success) {
        return fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            Authorization: `Bearer ${inMemoryAccessToken}`,
          },
        });
      }
    }
    return res;
  },
};
