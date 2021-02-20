import React, { useState } from 'react';
import { useFirebaseAuth } from './contexts/AuthContextFirebase';
import { Link, useHistory } from 'react-router-dom';
import { database } from './firebase';
import Navigation from './components/Navigation';

export default function Register() {

    const [name, setName] = useState('');
    const [conference, setConference] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const { register, currentUser } = useFirebaseAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        if(!(password === confirmPassword)) {
            return setError("Passwords do not match");
        }

        try {
            setError('')
            setLoading(true);
            let registeredUser = await register(email, password);

            if(registeredUser.user) {

                // create document with the account's UUID under users collection
                // TODO: Insecure, maybe have a verification process via email
                database.collection("users").doc(registeredUser.user.uid).set({
                    full_name: name,
                    conference: conference,
                })
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }


            history.push('/login')
        } catch {
            setError('Failed to create an account');
        }

        setLoading(false);
    }

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='action-container'>
                    <div className='login'>
                        <div className='login-inner'>
                            <h1>Register</h1>
                            {error && (
                                <div className='error-alert'>
                                    {error}
                                </div>
                            )}
                            <div className='input-group'>
                                <h3>Full Name</h3>
                                <input type="text" value={name} onChange={e=>setName(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Conference Name</h3>
                                <input type="text" value={conference} onChange={e=>setConference(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Email</h3>
                                <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Password</h3>
                                <input type="text" value={password} onChange={e=>setPassword(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Confirm Password</h3>
                                <input type="text" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                            </div>
                            <div className='text-tray'>
                                Please note that this registration page is designated for conference Secretariat members. <br /><br />
                                <Link className='text-link' to='/login' >
                                    Login Instead
                                </Link>
                            </div>
                            <div className='input-group'>
                                <input disabled={loading} onClick={handleSubmit} type="submit" value="Register" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}