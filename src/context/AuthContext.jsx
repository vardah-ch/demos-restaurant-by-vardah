import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { adminLogin as apiLogin, adminLogout, getAdminSession } from '../services/api';
import { storageKeys } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useLocalStorage(storageKeys.auth, getAdminSession());

  const login = useCallback(async (email, password) => {
    const next = await apiLogin(email, password);
    setSession(next);
    return next;
  }, [setSession]);

  const logout = useCallback(() => {
    adminLogout();
    setSession(null);
  }, [setSession]);

  const value = useMemo(
    () => ({ session, isAdmin: Boolean(session), login, logout }),
    [login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
