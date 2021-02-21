import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Navigation from './components/Navigation';

import { API_URL } from './config.js';
import { useAuthContext } from './authentication/AuthContext';

export default function Login() {

    const { updateCurrentUser } = useAuthContext();

    const [userRole, setUserRole] = useState('');

    // Secretariat Login hooks
    const [email, setEmail] = useState('');
    const [secPassword, setSecPassword] = useState('');
    const [secError, setSecError] = useState('');
    
    // Staff Login hooks
    const [username, setUsername] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [staffError, setStaffError] = useState('');

    const [loading, setLoading] = useState(false);

    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();

        axios.post(`${API_URL}/authentication/secretariat/login`, {
            email: email,
            password: secPassword,
        })
        .then(function (response) {

            updateCurrentUser(response.data);
            setSecError('success');
            
            history.push('/secretariat/dashboard')
        })
        .catch(function (error) {
            setSecError(JSON.stringify(error));
        });

        setLoading(false);
    }
    
    async function handleSubmitStaff(e) {

        // call database instead i suppose...

    }


    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='login-select'>
                    <h2>I'm a...</h2>
                    <div className='select'>
                        <div className={`toggle ${(userRole==='secretariat') ? ('active') : ('')}`} onClick={(e) => setUserRole('secretariat')}>
                            Secretariat
                        </div>
                        <div className={`toggle ${(userRole==='staff') ? ('active') : ('')}`} onClick={(e) => setUserRole('staff')}>
                            Staff
                        </div>
                    </div>
                </div>

                <div className='action-container'>
                    {(userRole === 'secretariat') ? (
                        <div className='login'>
                            <div className='login-inner'>
                                <h1>Secretariat Login</h1>
                                {secError && (
                                    <div className='error-alert'>
                                        {secError}
                                    </div>
                                )}
                                <div className='input-group'>
                                    <h3>Email</h3>
                                    <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                                </div>
                                <div className='input-group'>
                                    <h3>Password</h3>
                                    <input type="text" value={secPassword} onChange={e=>setSecPassword(e.target.value)} />
                                </div>
                                <div className='text-tray'>
                                    <Link className='text-link' to='/login/password-reset' >
                                        Forgot password
                                    </Link>
                                    <Link className='text-link' to='/register' >
                                        Register instead
                                    </Link>
                                </div>
                                <div className='input-group'>
                                    <input disabled={loading} onClick={handleSubmit} type="submit" value="Login" />
                                </div>    
                            </div>
                        </div>
                    ) : (
                        (userRole === 'staff') ? (
                            <div className='login'>
                                <div className='login-inner'>
                                    <h1>Staff Login</h1>
                                    {staffError && (
                                        <div className='error-alert'>
                                            {staffError}
                                        </div>
                                    )}
                                    <div className='input-group'>
                                        <h3>Username</h3>
                                        <input type="text" value={username} onChange={e=>setUsername(e.target.value)} />
                                    </div>
                                    <div className='input-group'>
                                        <h3>Password</h3>
                                        <input type="text" value={staffPassword} onChange={e=>setStaffPassword(e.target.value)} />
                                    </div>
                                    <div className='text-tray'>
                                        If you've forgotten your password, please contact a secretariat member.
                                    </div>
                                    <div className='input-group'>
                                        <input disabled={loading} onClick={handleSubmitStaff} type="submit" value="Login" />
                                    </div>    
                                </div>
                            </div>
                        ) : (
                            <div>

                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    )
}