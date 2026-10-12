import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { authService } from './authService';
import type { AuthState } from './authTypes';

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Silent refresh on mount (check for existing refresh token) ─────────
  useEffect(() => {
    const tryRestore = async () => {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        setState({ status: 'unauthenticated' });
        return;
      }
      try {
        const result = await authService.refresh();
        if (result.success && result.data) {
          setState({ status: 'authenticated', user: result.data.user, accessToken: result.data.accessToken });
          scheduleRefresh(result.data.expiresIn);
        } else {
          authService.clearTokens();
          setState({ status: 'unauthenticated' });
        }
      } catch {
        authService.clearTokens();
        setState({ status: 'unauthenticated' });
      }
    };
    tryRestore();
    return () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); };
  }, []);

  // ── Auto-refresh access token before expiry ────────────────────────────
  const scheduleRefresh = useCallback((expiresInSeconds: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const refreshIn = Math.max((expiresInSeconds - 60) * 1000, 10_000); // 1 min before expiry
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const result = await authService.refresh();
        if (result.success && result.data) {
          setState(prev =>
            prev.status === 'authenticated'
              ? { ...prev, accessToken: result.data!.accessToken }
              : prev
          );
          scheduleRefresh(result.data.expiresIn);
        } else {
          await logout();
        }
      } catch {
        await logout();
      }
    }, refreshIn);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Login failed');
    }
    setState({ status: 'authenticated', user: result.data.user, accessToken: result.data.accessToken });
    scheduleRefresh(result.data.expiresIn);
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    await authService.logout();
    setState({ status: 'unauthenticated' });
  }, []);

  const register = useCallback(async (
    firstName: string, lastName: string, email: string, password: string
  ) => {
    const result = await authService.register({ firstName, lastName, email, password });
    if (!result.success) {
      throw new Error(result.error?.message || 'Registration failed');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
