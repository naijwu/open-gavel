import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Navigation from './components/Navigation';

import { API_URL } from './config.js';
import { useAuthContext } from './authentication/AuthContext';
import Footer from './components/Footer';

export default function Login() {

    const { currentUser, updateCurrentUser } = useAuthContext();

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
        setLoading(true);

        axios.post(`${API_URL}/authentication/secretariat/login`, {
            email: email,
            password: secPassword,
        })
        .then(function (response) {

            updateCurrentUser(response.data);
            history.push('/secretariat/dashboard')
        })
        .catch(function (error) {
            setSecError(`${error.response.data.message}`);
            setLoading(false);
        });

        setLoading(false);
    }
    
    async function handleSubmitStaff(e) {
        e.preventDefault();
        setLoading(true);

        let sanitizedUser = username.replace(/\s/g, '');

        let splitUser = sanitizedUser.substring(0, sanitizedUser.indexOf('@'));
        let splitConference = sanitizedUser.substr(sanitizedUser.indexOf('@') + 1);
        
        let postBody = {
            username: splitUser,
            conference: splitConference,
            password: staffPassword,
        }

        axios.post(`${API_URL}/authentication/staff/login`, postBody)
        .then(function (response) {

            updateCurrentUser(response.data);
            history.push('/committee/dashboard');
        })
        .catch(function (error) {
            setStaffError(error.response.data.message);
            setLoading(false);
        });
        setLoading(false);
    }


    return (!currentUser) ? (
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
                                    <input type="password" value={secPassword} onChange={e=>setSecPassword(e.target.value)} />
                                </div>
                                <div className='text-tray'>
                                    {/* <Link className='text-link' to='/login/password-reset' >
                                        Forgot password
                                    </Link> */}
                                    <Link className='text-link' to='/register' >
                                        Register instead
                                    </Link>
                                </div>
                                <div className='input-group submit'>
                                    <input disabled={loading} className={`isdisabled${loading}`} onClick={handleSubmit} type="submit" value="Login" />
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
                                        <input type="password" value={staffPassword} onChange={e=>setStaffPassword(e.target.value)} />
                                    </div>
                                    <div className='text-tray'>
                                        <div className='notification'>
                                            If you've forgotten your password, please contact a secretariat member.
                                        </div>
                                    </div>
                                    <div className='input-group submit'>
                                        <input disabled={loading} className={`isdisabled${loading}`} onClick={handleSubmitStaff} type="submit" value="Login" />
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
            <Footer />
        </>
    ) : (
        <>
            <Navigation />
            <div className='main leave'>
                <div className='container'>
                    You're already logged in.
                </div>
            </div>
            <Footer />
        </>
    )
}