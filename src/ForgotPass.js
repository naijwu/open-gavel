import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';

export default function ForgotPass() {

    const [email, setEmail] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');


    async function handleSubmit(e) {
        e.preventDefault();

    }

    
    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='action-container'>
                    <div className='login'>
                        <div className='login-inner'>
                            <h1>Forgot Password</h1>
                            {error && (
                                <div className='error-alert'>
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className='message-alert'>
                                    {message}
                                </div>
                            )}
                            <div className='input-group'>
                                <h3>Email</h3>
                                <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                            </div>
                            <div className='text-tray'>
                                <Link className='text-link' to='/login' >
                                    Go to login
                                </Link>
                            </div>
                            <div className='input-group'>
                                <input disabled={loading} onClick={handleSubmit} type="submit" value="Reset Password" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}