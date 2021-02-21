import React, { useContext, useState, useEffect } from 'react';
import { createContext } from 'react';
import { decodeToken, destroySession, getTokenFromSession, storeSession } from './AuthService';

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    // set state from session
    const [currentUser, setCurrentUser] = useState(getTokenFromSession ? getTokenFromSession : '');

    function updateCurrentUser(userToken) {
        setCurrentUser(userToken);
        if(userToken === '') {
            destroySession();
        } else {
            storeSession(userToken);
        }
    }

    function getTokenData() {
        return decodeToken(currentUser);
    }

    const value = {
        updateCurrentUser,
        getTokenData,
        currentUser        
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}