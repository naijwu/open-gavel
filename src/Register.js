import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';

// TODO: Put all authentication related files into one place - API_URL should only be called once
import { API_URL } from './config.js';
import { useAuthContext } from './authentication/AuthContext';
import Footer from './components/Footer';

export default function Register() {

    const { currentUser } = useAuthContext();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [conference, setConference] = useState('');
    const [conferenceFullName, setConferenceFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


    // TODO: More robust and UI-friendly form feedback
    function isValid() {

        if (firstName === '' || lastName === '' || conference === '' || email === '' || password == '' || conferenceFullName == '') return false;

        return true;
    }

    function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError('');
        
        if(!(isValid())) {
            setLoading(false);
            return setError("Inappropriate input values given.")
        };

        if(!(password === confirmPassword)) {
            setLoading(false);
            return setError("Passwords do not match.")
        };
        

        axios.post(`${API_URL}/authentication/secretariat/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            conferenceFullName: conferenceFullName,
            conference: conference
        })
        .then(function (response) {
            setError('');
            setSuccess(`You've successfully registered.`);
        })
        .catch(function (error) {
            setSuccess('');
            setError(JSON.stringify(error));
        });
    }

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='action-container'>
                    <div className='login'>
                        <div className='login-inner'>
                            <h1>Register</h1>
                            <div className='input-group'>
                                <h3>First Name</h3>
                                <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Last Name</h3>
                                <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Conference Name</h3>
                                <input type="text" value={conferenceFullName} onChange={e=>setConferenceFullName(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Abbreviated Conference Name</h3>
                                <input type="text" value={conference} onChange={e=>setConference(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Email</h3>
                                <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Password</h3>
                                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                            </div>
                            <div className='input-group'>
                                <h3>Confirm Password</h3>
                                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                            </div>
                            <div className='text-tray'>
                                <div className='notification mb-30'>
                                    Please note that this registration page is designated for conference Secretariat members.
                                </div>
                                <Link className='text-link' to='/login' >
                                    Login Instead
                                </Link>
                            </div>
                            <div className='input-group submit'>
                                <input className={`isdisabled${loading}`} disabled={loading} onClick={handleSubmit} type="submit" value="Register" />
                            </div>
                            {error && (
                                <div className='error-alert'>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className='success-alert'>
                                    {success}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}