import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

export function AuthProviderNode({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function register(email, password) {
        

    }

    function login(email, password) {
        

    }

    function loginStaff(email, password) {
        

    }

    function logout() {
        


    }

    function resetPassword(email) {


    }

    function updateEmail(email) {


    }

    function updatePassword(password) {


    }

    const value = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        loginStaff,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}