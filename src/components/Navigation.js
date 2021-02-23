import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect, useHistory } from 'react-router-dom';

import { useAuthContext } from '../authentication/AuthContext';

const Navigation = () => {

    const { currentUser, updateCurrentUser, getTokenData } = useAuthContext();

    const history = useHistory();

    function handleLogout(e) {
        e.preventDefault();

        updateCurrentUser('');
    }

    return (
        
        <div className='header'>
            <div className='header-inner'>
                <div className='logo'>
                    <Link className='logo-link' to='/'>
                        opengavel
                    </Link>
                </div>
                <div className='navigation'>
                    {/* {(currentUser) ? '' : (
                        <NavLink className='nav-link' activeClassName='active' to="demo">View Demo</NavLink>
                    )} */}
                    {(currentUser) ? (
                        // need further splitting based on role (staff vs secretariat)
                        <>
                            <NavLink className='nav-link' to="/support">Support</NavLink>
                            {(getTokenData().type==='staff') ? (
                                <>
                                    <NavLink className='nav-link' to='/committee/dashboard'>Dashboard</NavLink>
                                    <NavLink className='nav-link member colour' to='/chair'>Launch App</NavLink>
                                </>
                            ) : (
                                <NavLink className='nav-link' to='/secretariat/dashboard'>Dashboard</NavLink>
                            )}
                            <button className='nav-link member' onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <NavLink className='nav-link member' to="/login">Login</NavLink>
                            <NavLink className='nav-link member' to="/register">Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navigation;