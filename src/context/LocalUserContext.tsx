import React, { useEffect } from 'react';

import { ILocalUser } from './ILocalUser';

type LocalUserContextType = {
  getLocalUser: () => ILocalUser | null;
  isUserLoggedIn: () => boolean;
  setUserLoggedIn: (user: ILocalUser) => void;
  setUserLoggedOut: () => void;
}

const LocalUserContext = React.createContext<LocalUserContextType | null>(null);

const LocalUserProvider = ({ children }: any): JSX.Element => {
  useEffect(() => {
    const user = getLocalUser();
    setLocalUser(user);
  }, []);

  const [localUser, setLocalUser] = React.useState<ILocalUser | null>(null);

  const getLocalUser = (): ILocalUser | null => {
    try {
      return JSON.parse(localStorage.getItem('user') || '---') as ILocalUser;
    } catch (e) {
      return null;
    }
  }
  
  const setUserLoggedIn = (user: ILocalUser): void => {
    localStorage.setItem('user', JSON.stringify(user));
    setLocalUser(user);
  }
  
  const setUserLoggedOut = (): void => {
    localStorage.removeItem('user');
    setLocalUser(null);
  }

  const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('user');
  }

  return (
    <LocalUserContext.Provider 
      value={{ getLocalUser, isUserLoggedIn, setUserLoggedIn, setUserLoggedOut }}>
      {children}
    </LocalUserContext.Provider>
  )
}

export default  LocalUserContext;

export { LocalUserProvider };

export function localUserContext(): LocalUserContextType {
  const context = React.useContext(LocalUserContext);

  if (!context) {
    throw new Error('localUserContext must be used within a LocalUserContext');
  }

  return context;
}
