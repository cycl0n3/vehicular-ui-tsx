import React, {
    ReactNode,
    useEffect
} from 'react';

import {User} from '../types/User';

type UserContextType = {
    user: User | null;
    // getLocalUser: () => User | null;
    valid: () => boolean;
    login: (user: User) => void;
    logout: () => void;
}

const UserContext = React.createContext<UserContextType>({} as UserContextType);

const UserContextProvider = ({children}: {children: ReactNode}) => {
    useEffect(() => {
        const user = getUser();
        setUser(user);
    }, []);

    const [localUser, setUser] = React.useState<User | null>(null);

    const getUser = () => {
        try {
            const userStr = localStorage.getItem('user') || '';
            return JSON.parse(userStr) as User;
        } catch (e) {
            logout();
            return null;
        }
    }

    const login = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    const valid = () => {
        try {
            const userStr = localStorage.getItem('user') || '{}';
            const user= JSON.parse(userStr) as User;
            return user !== null
                && user.username !== undefined
                && user.username !== ''
                && user.accessToken !== undefined
                && user.accessToken !== '';
        } catch (e) {
            return false;
        }
    }

    return (
        <UserContext.Provider
            value={{user: localUser, /*getUser,*/ valid, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;

export {UserContextProvider};
