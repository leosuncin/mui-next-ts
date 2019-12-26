import React, { createContext, useState, useContext } from 'react';

import { User } from 'pages/api/auth/login';

const UserStateContext = createContext<User>(null);
const UserDispatchContext = createContext<React.Dispatch<User>>(null);

export const UserProvider: React.FC<{ initialUser?: User }> = props => {
  const [user, setUser] = useState(props.initialUser);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export function useUserState() {
  return useContext(UserStateContext);
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);

  if (!context)
    throw new Error('useUserDispatch must be used within a UserProvider');

  return context;
}
