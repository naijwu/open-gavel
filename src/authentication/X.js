import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase';
import { auth } from '../firebase';

const AuthContext = React.createContext();
let provider = new firebase.auth.GoogleAuthProvider();

export function useFirebaseAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function register(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function loginUsingGoogle() {
        return auth.signInWithPopup(provider);
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
        // code flows to here after register or login
        const unsubscribe = auth.onAuthStateChanged(user => {

            // done loading
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe; // unsubscribes from component
    }, [])

    const value = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        loginUsingGoogle,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}