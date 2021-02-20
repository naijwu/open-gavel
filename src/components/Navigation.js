import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect, useHistory } from 'react-router-dom';
import { AuthProvider, useFirebaseAuth } from '../contexts/AuthContextFirebase';

const Navigation = () => {
    const { currentUser, logout } = useFirebaseAuth();

    const history = useHistory();

    async function handleLogout(e) {
        e.preventDefault();

        try {
            await logout();
            history.push('/');
        } catch {
            console.log('Failed to log out.');
        }
    }

    return (
        
        <div className='header'>
            <div className='header-inner'>
                <div className='logo'>
                    <Link className='logo-link' to='/'>
                        OpenGavel
                    </Link>
                </div>
                <div className='navigation'>
                    <NavLink className='nav-link' activeClassName='active' to="demo">View Demo</NavLink>
                    <NavLink className='nav-link' to="support">Support</NavLink>
                    {(currentUser) ? (
                        // need further splitting based on role (staff vs secretariat)
                        <>
                            <NavLink className='nav-link member colour' to='chair'>Chair</NavLink>
                            <NavLink className='nav-link member colour' to='dashboard'>Dashboard</NavLink>
                            <button className='nav-link member' onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <NavLink className='nav-link member' to="login">Login</NavLink>
                            <NavLink className='nav-link member' to="register">Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navigation;