import React, {
    ReactNode,
    useEffect
} from 'react';

import {ILocalUser} from '../types/ILocalUser';

type LocalUserContextType = {
    localUser: ILocalUser | null;
    // getLocalUser: () => ILocalUser | null;
    isUserLoggedIn: () => boolean;
    setUserLoggedIn: (user: ILocalUser) => void;
    setUserLoggedOut: () => void;
}

const LocalUserContext = React.createContext<LocalUserContextType>({} as LocalUserContextType);

const LocalUserContextProvider = ({children}: {children: ReactNode}): JSX.Element => {
    useEffect(() => {
        const user = getLocalUser();
        setLocalUser(user);
    }, []);

    const [localUser, setLocalUser] = React.useState<ILocalUser | null>(null);

    const getLocalUser = (): ILocalUser | null => {
        try {
            const userStr = localStorage.getItem('user') || '';
            return JSON.parse(userStr) as ILocalUser;
        } catch (e) {
            setUserLoggedOut();
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
            value={{localUser, /*getLocalUser,*/ isUserLoggedIn, setUserLoggedIn, setUserLoggedOut}}>
            {children}
        </LocalUserContext.Provider>
    )
}

export default LocalUserContext;

export {LocalUserContextProvider};
