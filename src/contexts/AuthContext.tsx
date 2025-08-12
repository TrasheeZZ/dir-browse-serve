import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = [
  { id: '1', username: 'admin', password: 'admin123', role: 'ADMIN' as const, createdAt: new Date() },
  { id: '2', username: 'user', password: 'user123', role: 'USER' as const, createdAt: new Date() },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('file-index-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('file-index-user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({ user: userWithoutPassword, isAuthenticated: true });
      localStorage.setItem('file-index-user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('file-index-user');
  };

  const updateUser = (user: User) => {
    setAuthState(prev => ({ ...prev, user }));
    localStorage.setItem('file-index-user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}