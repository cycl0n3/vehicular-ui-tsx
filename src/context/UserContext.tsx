import React, {
    ReactNode,
    useEffect
} from 'react';

import {UserAuth} from '../types/UserAuth';

type UserContextType = {
    userAuth: UserAuth | null;
    valid: () => boolean;
    login: (user: UserAuth) => void;
    logout: () => void;
}

const UserContext = React.createContext<UserContextType>({} as UserContextType);

const UserContextProvider = ({children}: {children: ReactNode}) => {
    useEffect(() => {
        const user = getUser();
        setUser(user);
    }, []);

    const [localUser, setUser] = React.useState<UserAuth | null>(null);

    const getUser = () => {
        try {
            const userStr = localStorage.getItem('userAuth') || '';
            return JSON.parse(userStr) as UserAuth;
        } catch (e) {
            logout();
            return null;
        }
    }

    const login = (user: UserAuth) => {
        localStorage.setItem('userAuth', JSON.stringify(user));
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('userAuth');
        setUser(null);
    }

    const valid = () => {
        try {
            const userStr = localStorage.getItem('user') || '{}';
            const user= JSON.parse(userStr) as UserAuth;
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
            value={{userAuth: localUser, /*getUser,*/ valid, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;

export {UserContextProvider};
