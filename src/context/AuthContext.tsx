import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, AuditEntry } from '../types';
import { DEMO_CREDENTIALS } from '../config/roles';

interface AuthContextType {
  user: User | null;
  auditLog: AuditEntry[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addAuditEntry: (action: string, entityId?: string, entityType?: string, reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'rakshak_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  const addAuditEntry = useCallback((
    action: string,
    entityId?: string,
    entityType?: string,
    reason?: string,
  ) => {
    if (!user) return;
    const entry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityId,
      entityType: entityType as AuditEntry['entityType'],
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.***',
      reason,
      sessionId: `SES-${user.id}-${Date.now().toString(36)}`,
    };
    setAuditLog(prev => [entry, ...prev]);
  }, [user]);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const cred = DEMO_CREDENTIALS.find(c => c.username === username && c.password === password);
    if (!cred) {
      return { success: false, error: 'Invalid credentials. Please check your badge number and password.' };
    }

    const newUser: User = {
      id: `USR-${cred.badgeNumber}`,
      name: cred.name,
      badgeNumber: cred.badgeNumber,
      role: cred.role as UserRole,
      department: cred.department,
      station: cred.station,
      state: cred.state,
    };

    setUser(newUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

    // Add login audit
    const loginEntry: AuditEntry = {
      id: `AUD-LOGIN-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      userRole: newUser.role,
      action: 'USER_LOGIN',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.***',
      sessionId: `SES-${newUser.id}-${Date.now().toString(36)}`,
    };
    setAuditLog([loginEntry]);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    addAuditEntry('USER_LOGOUT');
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, [addAuditEntry]);

  // Auto-add page navigation audit entries
  useEffect(() => {
    if (user) {
      addAuditEntry('SESSION_ACTIVE', undefined, undefined, 'Periodic session ping');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, auditLog, isAuthenticated: !!user, login, logout, addAuditEntry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
