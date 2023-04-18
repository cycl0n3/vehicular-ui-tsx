import React, { useEffect } from 'react';

export interface IUser {
  username: string;
  accessToken: string;
}

type UserContextType = {
  user: IUser | undefined;

  getUser: () => IUser | undefined;
  isUserLoggedIn: () => boolean;
  setUserLoggedIn: (user: IUser) => void;
  setUserLoggedOut: () => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: any) => {
  useEffect(() => {
    const user = getUser();
    setUser(user);
  }, []);

  const [user, setUser] = React.useState<IUser | undefined>(undefined);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '---') as IUser;
    } catch (e) {
      return undefined;
    }
  }
  
  const setUserLoggedIn = (user: IUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }
  
  const setUserLoggedOut = () => {
    localStorage.removeItem('user');
    setUser(undefined);
  }

  const isUserLoggedIn = () => {
    return !!localStorage.getItem('user');
  }

  return (
    <UserContext.Provider 
      value={{ user, getUser, isUserLoggedIn, setUserLoggedIn, setUserLoggedOut }}>
      {children}
    </UserContext.Provider>
  )
}

export default  UserContext;

export { UserProvider };

export function userContext() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
