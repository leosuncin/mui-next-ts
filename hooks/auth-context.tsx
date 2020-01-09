import cookie from 'js-cookie';
import React, { createContext, useContext } from 'react';

import login, { AuthLogin } from 'services/login';
import { useUserDispatch } from 'hooks/user-context';
import register, { AuthRegister } from 'services/register';

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
      cookie.set('sessionUser', user, { sameSite: 'strict' });
      setUser(user);
    },
    logout() {
      setUser(null);
      cookie.remove('sessionUser');
      localStorage.setItem('logoutAt', new Date().toISOString());
    },
    async register(body) {
      const user = await register(body);
      cookie.set('sessionUser', user, { sameSite: 'strict' });
      setUser(user);
    },
  };

  return <AuthContext.Provider value={defaultContextValue} {...props} />;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within a AuthProvider');

  return context;
}
