import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect } from 'react-router-dom';

const Demo = () => {

    return (
        <>
            <div className='minimized-header'>
                <div className='logo-mini'>
                    <Link className='logo-link' to='/'>
                        OpenGavel
                    </Link>
                    <span className='logo-thin'>
                        Demo
                    </span>
                </div>
                <div className='navigation-mini'>
                    <NavLink className='nav-link' to="/">Return Home</NavLink>
                </div>
            </div>
        </>
    )
}

export default Demo;