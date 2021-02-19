import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import Navigation from './components/Navigation';

export default function Login() {

    const [userRole, setUserRole] = useState('');

    // Secretariat Login hooks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Staff Login hooks
    const [username, setUsername] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [staffError, setStaffError] = useState('');

    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('')
            setLoading(true);
            await login(email, password);
            history.push('/chair');
        } catch {
            setError('Failed to log in.');
        }

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
                                {error && (
                                    <div className='error-alert'>
                                        {error}
                                    </div>
                                )}
                                <div className='input-group'>
                                    <h3>Email</h3>
                                    <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                                </div>
                                <div className='input-group'>
                                    <h3>Password</h3>
                                    <input type="text" value={password} onChange={e=>setPassword(e.target.value)} />
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