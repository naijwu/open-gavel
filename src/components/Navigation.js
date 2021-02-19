import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect } from 'react-router-dom';

const Navigation = () => {

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
                    <NavLink className='nav-link member' to="login">Login</NavLink>
                    <NavLink className='nav-link member' to="register">Register</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Navigation;