import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('')
            setLoading(true);
            await login(email, password);
            history.push('/app/preview');
        } catch {
            setError('Failed to log in');
        }

        setLoading(false);
    }

    return (
        <>
            <div className='account-component'>
                <h1>Login</h1>
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
                    <Link className='text-link' to='/app/forgot' >
                        Forgot password
                    </Link>
                    <Link className='text-link' to='/app/register' >
                        Register instead
                    </Link>
                </div>
                <div className='input-group'>
                    <input disabled={loading} onClick={handleSubmit} type="submit" value="Login" />
                </div>
            </div>
            <div className='account-component-back'>
                <Link className='text-link back' to='/' >
                    Return Home
                </Link>
            </div>
        </>
    )
}