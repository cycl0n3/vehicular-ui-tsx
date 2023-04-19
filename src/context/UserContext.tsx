import React, { useEffect } from 'react';

export interface IUser {
  username: string;
  accessToken: string;
}

type UserContextType = {
  user: IUser | null;

  getUser: () => IUser | null;
  isUserLoggedIn: () => boolean;
  setUserLoggedIn: (user: IUser) => void;
  setUserLoggedOut: () => void;
}

const UserContext = React.createContext<UserContextType | null>(null);

const UserProvider = ({ children }: any) => {
  useEffect(() => {
    const user = getUser();
    setUser(user);
  }, []);

  const [user, setUser] = React.useState<IUser | null>(null);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '---') as IUser;
    } catch (e) {
      return null;
    }
  }
  
  const setUserLoggedIn = (user: IUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }
  
  const setUserLoggedOut = () => {
    localStorage.removeItem('user');
    setUser(null);
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

export function userContext(): UserContextType {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
