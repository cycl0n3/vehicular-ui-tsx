import React, {
    ReactNode,
    useEffect
} from 'react';

import {IUser} from '../types/IUser';

type UserContextType = {
    user: IUser | null;
    // getLocalUser: () => IUser | null;
    valid: () => boolean;
    login: (user: IUser) => void;
    logout: () => void;
}

const UserContext = React.createContext<UserContextType>({} as UserContextType);

const UserContextProvider = ({children}: {children: ReactNode}) => {
    useEffect(() => {
        const user = getUser();
        setUser(user);
    }, []);

    const [localUser, setUser] = React.useState<IUser | null>(null);

    const getUser = () => {
        try {
            const userStr = localStorage.getItem('user') || '';
            return JSON.parse(userStr) as IUser;
        } catch (e) {
            logout();
            return null;
        }
    }

    const login = (user: IUser) => {
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
            const user= JSON.parse(userStr) as IUser;
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
