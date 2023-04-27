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
        const user = getUserAuth();
        setUserAuth(user);
    }, []);

    const [userAuth, setUserAuth] = React.useState<UserAuth | null>(null);

    const getUserAuth = () => {
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
        setUserAuth(user);
    }

    const logout = () => {
        localStorage.removeItem('userAuth');
        setUserAuth(null);
    }

    const valid = () => {
        try {
            const userStr = localStorage.getItem('userAuth') || '';
            const user= JSON.parse(userStr) as UserAuth;
            return user !== null;
        } catch (e) {
            return false;
        }
    }

    return (
        <UserContext.Provider
            value={{userAuth, /*getUserAuth,*/ valid, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;

export {UserContextProvider};
