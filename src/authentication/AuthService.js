import React from 'react';
import jwt from 'jsonwebtoken';

function decodeToken(token) {
    const decoded = jwt.decode(String(token));

    return decoded;
}

function getTokenFromSession() {
    return JSON.parse(sessionStorage.getItem('userToken'));
}

function storeSession(token) {
    sessionStorage.setItem('userToken', JSON.stringify(token));
}

// for logging out
function destroySession() {
    sessionStorage.removeItem('userToken');
}


export { decodeToken, getTokenFromSession, storeSession, destroySession };