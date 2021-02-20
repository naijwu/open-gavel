import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect } from 'react-router-dom';

const Demo = () => {

    const [show, setShow] = useState();

    const testRequest = (e) => {
        axios.get('http://localhost:8080/api/staff', {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMwN2RiZjEwNTFmODMwZTg4N2Y4OTYiLCJjb25mZXJlbmNlIjoiQ0FIU01VTiIsInR5cGUiOiJzZWNyZXRhcmlhdCIsImlhdCI6MTYxMzc5NDM3Nn0.zH0VlwR9D6XoTLZ9tbxmAUpHZItxAHADfb0L--CIMRU',
            }
        }).then((res) => {
            setShow(JSON.stringify(res.data));
        }).catch((err) => {
            setShow(JSON.stringify(err));
        })
    }

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
            <div className='demo-main'>

                <div>
                    <h1>Main Demo</h1>
                    <button onClick={testRequest}>Click me to see all users</button>
                    {show}
                </div>

            </div>
        </>
    )
}

export default Demo;