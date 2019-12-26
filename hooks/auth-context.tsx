import cookie from 'js-cookie';
import React, { createContext, useContext } from 'react';

import login, { AuthLogin } from 'services/login';
import { useUserDispatch } from 'hooks/user-context';

type AuthContextType = {
  login: (body: AuthLogin) => Promise<void>;
  logout: () => void;
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
  };

  return <AuthContext.Provider value={defaultContextValue} {...props} />;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within a AuthProvider');

  return context;
}
