import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';

const Navigation = () => {

    return (
        
        <div className='header'>
            <div className='header-inner'>
                <div className='logo'>
                    OpenGavel
                </div>
                <div className='navigation'>
                    <NavLink className='nav-link' to="login">Demo Program</NavLink>
                    <NavLink className='nav-link member' activeClassName='active' to="login">Login</NavLink>
                    <NavLink className='nav-link member' to="register">Register</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Navigation;