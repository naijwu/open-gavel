import React, { useContext, useEffect, useState } from 'react';
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

    const noInputErrors = {
        fn: '', // first name error
        ln: '', // last name error
        cn: '', // conference name error
        acn: '', // abbreviated conference name error
        em: '', // email error
        pass: '', // password error
        cp: '', // confirm password error
    };
    const [ inputErrors, setInputErrors ] = useState(noInputErrors);


    // TODO: More robust and UI-friendly form feedback
    function isValid() {

        let fnPass = true, lnPass = true, cnPass = true, acnPass = true, emPass = true, passPass = true, cpPass = true;
        let errors = noInputErrors;

        // first pass - check if any fields are empty
        if (firstName === '' || lastName === '' || conference === '' || email === '' || password == '' || conferenceFullName == '') {
            return setError('All fields are required.');
        }

        // second pass(es) - check individual fields
        if (firstName.length < 3) {
            fnPass = false;
            errors = {
                ...errors,
                fn: 'First name must be over 3 characters.'
            }
        } if (firstName.length > 30) {
            fnPass = false;
            errors = {
                ...errors,
                fn: 'First name cannot exceed 30 characters.'
            }
        }
        if (lastName.length < 3) {
            lnPass = false;
            errors = {
                ...errors,
                ln: 'Last name must be over 3 characters.'
            }
        } if (lastName.length > 30) {
            lnPass = false;
            errors = {
                ...errors,
                ln: 'First name cannot exceed 30 characters.'
            }
        }
        if (conferenceFullName.length < 5) {
            cnPass = false;
            errors = {
                ...errors,
                cn: 'Conference name cannot be less than 5 characters.'
            }
        } if (conferenceFullName.length > 100) {
            cnPass = false;
            errors = {
                ...errors,
                cn: 'Conference name cannot exceed 100 characters.'
            }
        }
        if (conference.length < 3) {
            cnPass = false;
            errors = {
                ...errors,
                acn: 'Abbreviated name cannot be less than 3 characters.'
            }
        } if (conference.length > 25) {
            cnPass = false;
            errors = {
                ...errors,
                acn: 'Abbreviated name cannot exceed 25 characters.'
            }
        }
        if (email.length < 5) {
            cnPass = false;
            errors = {
                ...errors,
                em: 'Email name cannot be less than 5 characters.'
            }
        }
        if (!email.includes('@')) {
            emPass = false;
            errors = {
                ...errors,
                em: 'You must enter an email address.'
            }
        }
        if (password.length < 5) {
            passPass = false;
            errors = {
                ...errors,
                pass: 'Password cannot be less than 5 characters.'
            }
        } if (password.length > 150) {
            passPass = false;
            errors = {
                ...errors,
                pass: 'Password cannot exceed 150 characters.'
            }
        }
        if(password !== confirmPassword) {
            cpPass = false;
            errors = {
                ...errors,
                cp: 'Passwords do not match.'
            }
        }

        if(fnPass && lnPass && cnPass & acnPass && emPass && passPass && cpPass) {
            return 'valid';
        } else {
            setInputErrors({
                ...errors
            });
        }
        return setError('Please fix the form errors. Sorry!');
    }
    const [refr, setRefr] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError('');
        setInputErrors(noInputErrors);
        // setRefr(refr ? false : true);

        // validate
        if(!(isValid() === 'valid')) {
            return setLoading(false);
        };

        try {
            // fetch data from a url endpoint
            const response = await axios.post(`${API_URL}/authentication/secretariat/register`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                conferenceFullName: conferenceFullName,
                conference: conference
            });
            const data = await response.json();

            setError('');
            setSuccess(`You've successfully registered.`);

            return data;
        } catch (error) {
            if(error.response) {
                setSuccess('');
                setError(error.response.data.message);
                setLoading(false);
            } else {
                setError('');
                setSuccess(`You've successfully registered.`);
            }
        }
        
    }

    return (!currentUser) ? (
        <>
            <Navigation />
            <div className='main'>
                <div className='action-container'>
                    <div className='login'>
                        <div className='login-inner'>
                            <h1>Register</h1>
                            <div className={`input-group err${(inputErrors.fn) ? 'true' : ''}`}>
                                <h3>First Name</h3>
                                <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value.replace(/[^\w\s\'\zàâçéèêëîïôûùüÿñæœ]/gi, ''))} />
                                <div className='input-error'>
                                    {inputErrors.fn}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.ln) ? 'true' : ''}`}>
                                <h3>Last Name</h3>
                                <input type="text" value={lastName} onChange={e=>setLastName(e.target.value.replace(/[^\w\s\'\zàâçéèêëîïôûùüÿñæœ]/gi, ''))} />
                                <div className='input-error'>
                                    {inputErrors.ln}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.cn) ? 'true' : ''}`}>
                                <h3>Conference Name</h3>
                                <input type="text" value={conferenceFullName} onChange={e=>setConferenceFullName(e.target.value.replace(/[^\w\s\'\zàâçéèêëîïôûùüÿñæœ]/gi, ''))} />
                                <div className='input-error'>
                                    {inputErrors.cn}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.acn) ? 'true' : ''}`}>
                                <h3>Abbreviated Conference Name</h3>
                                <input type="text" value={conference} onChange={e=>setConference(e.target.value.replace(/[^\w\s\'\zàâçéèêëîïôûùüÿñæœ]/gi, ''))} />
                                <div className='input-error'>
                                    {inputErrors.acn}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.em) ? 'true' : ''}`}>
                                <h3>Email</h3>
                                <input type="text" value={email} onChange={e=>setEmail(e.target.value.replace(/[^\w\.\@\zàâçéèêëîïôûùüÿñæœ]/gi, ''))} />
                                <div className='input-error'>
                                    {inputErrors.em}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.pass) ? 'true' : ''}`}>
                                <h3>Password</h3>
                                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                                <div className='input-error'>
                                    {inputErrors.pass}
                                </div>
                            </div>
                            <div className={`input-group err${(inputErrors.cp) ? 'true' : ''}`}>
                                <h3>Confirm Password</h3>
                                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                                <div className='input-error'>
                                    {inputErrors.cp}
                                </div>
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
    );
}