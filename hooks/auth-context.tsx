import { useUserDispatch } from 'hooks/user-context';
import { login, logout, register } from 'libs/api-client';
import React, { createContext, useContext } from 'react';
import { AuthLogin, AuthRegister } from 'types';

type AuthContextType = {
  login: (body: AuthLogin) => Promise<void>;
  logout: () => void;
  register: (body: AuthRegister) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider: React.FC = props => {
  const setUser = useUserDispatch();
  const defaultContextValue: AuthContextType = {
    async login(body) {
      const user = await login(body);
      setUser(user);
    },
    async logout() {
      await logout();
      setUser(null);
      localStorage.setItem('logoutAt', new Date().toISOString());
    },
    async register(body) {
      const user = await register(body);
      setUser(user);
    },
  };

  return <AuthContext.Provider value={defaultContextValue} {...props} />;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within a AuthProvider');

  return context;
}
