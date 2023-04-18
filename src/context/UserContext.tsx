import React, { useEffect } from 'react';

export interface ICurrentUser {
  id: number;
  username: string;
}

type CurrentUserContextType = {
  currentUser: ICurrentUser | undefined;

  getCurrentUser: () => ICurrentUser | undefined;
  isUserLoggedIn: () => boolean;
  setUserLoggedIn: (user: ICurrentUser) => void;
  setUserLoggedOut: () => void;
}

const UserContext = React.createContext<CurrentUserContextType | undefined>(undefined);

const CurrentUserProvider = ({ children }: any) => {
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const [currentUser, setCurrentUser] = React.useState<ICurrentUser | undefined>(undefined);

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '---') as ICurrentUser;
    } catch (e) {
      return undefined;
    }
  }
  
  const setUserLoggedIn = (user: ICurrentUser) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  }
  
  const setUserLoggedOut = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(undefined);
  }

  const isUserLoggedIn = () => {
    return !!localStorage.getItem('currentUser');
  }

  return (
    <UserContext.Provider 
      value={{ currentUser, getCurrentUser, isUserLoggedIn, setUserLoggedIn, setUserLoggedOut }}>
      {children}
    </UserContext.Provider>
  )
}

export default  UserContext;

export { CurrentUserProvider };

export function userContext() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
