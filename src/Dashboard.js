import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect, useHistory } from 'react-router-dom';
import { useAuthContext } from './authentication/AuthContext';
import { API_URL } from './config';
import Footer from './components/Footer';
import EditModal from './components/EditModal';
import ConfirmModal from './components/ConfirmModal';
import CommitteeModal from './components/CommitteeModal';
import EditCommitteeModal from './components/EditCommitteeModal';

const Dashboard = () => {
    const { currentUser, updateCurrentUser, getTokenData } = useAuthContext();

    // edit secretariat account profile
    const [editModal, setEditModal] = useState(''); // Hook for modal opening to edit first name
    const [updateError, setUpdateError] = useState('');
    const [editValue, setEditValue] = useState('');

    // edit committee accounts
    const [committeeEditModal, setCommitteeEditModal] = useState(false); // modal up/down state
    const [updateId, setUpdateId] = useState(false); // internal -- for handling
    const [updatedName, setUpdatedName] = useState(''); // name of the committee 
    const [updatedUsername, setUpdatedUsername] = useState(''); // username
    const [updatedPassword, setUpdatedPassword] = useState(''); // password
    const [editCommitteeError, setEditCommitteeError] = useState(''); // errors

    // creating new committee (via modal)
    const [committeeModal, setCommitteeModal] = useState(false);
    const [committeeError, setCommitteeError] = useState('');

    // confirm deletion modals
    const [flaggedId, setFlaggedId] = useState('');
    const [flaggedIdType, setFlaggedIdType] = useState('');
    const [confirmError, setConfirmError] = useState('');

    // displaying committee accounts
    const [committeesList, setCommitteesList] = useState();
    const userData = getTokenData();

    const history = useHistory();

    useEffect(() => {

        axios.get(`${API_URL}/staff/${userData.conference}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            setCommitteesList(res.data);
        }).catch((err) => {
            setCommitteesList(err);
        });

    }, []);

    const displayCommitteeAccounts = () => {
        let displayArray = [];

        if (committeesList.length === 0) {
            return (
                <div className='empty-table'>
                    Wow, so empty!
                </div>
            )
        } 

        for (let i = 0; i < committeesList.length; i++) {
            displayArray.push(
                <tr>
                    {/* <td>{committeesList[0]._id}</td> */}
                    <td>{committeesList[i].committee}</td>
                    <td>{`${committeesList[i].username}@${committeesList[i].conference.toLowerCase()}`}</td>
                    <td>{committeesList[i].password}</td>
                    <td className='mitochondria'>
                        <button className='comm-actions edit' onClick={e=>{
                            setUpdateId(committeesList[i]._id)
                            setUpdatedName(committeesList[i].committee)
                            setUpdatedUsername(committeesList[i].username)
                            setUpdatedPassword(committeesList[i].password)
                            setCommitteeEditModal(true)
                        }}>Edit</button>
                        <button className='comm-actions delete' onClick={e=>{setFlaggedId(committeesList[i]._id); setFlaggedIdType('staff')}}>Delete</button>
                    </td>
                </tr>
            )
        };
        
        return displayArray;
    }

    // edit modal for editing profile
    const handleEdit = (type, value) => {
        setUpdateError('');

        let patchBody = {};
        let sanitizedValue;

        // sanitize string (get rid of funky characters or preceding/trailing whitespaces)


        if(userData[type] !== value) {
            // if new value, add to patchBody
            patchBody[type] = value;
        } else {
            // no changes made
            return setEditModal('');
        };

        axios.patch(`${API_URL}/secretariat/${userData._id}`, patchBody, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {            
            setEditModal('');
            updateCurrentUser(res.data.token);

            history.go(0);
        }).catch((err) => {
            
            setUpdateError(err.message);
        });
    }

    const handleCreateCommittee = (name, username, password) => {
        
        let postBody = {
            committee: name,
            username: username,
            password: password,
            conference: userData.conference
        }

        axios.post(`${API_URL}/staff`, postBody, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            setCommitteeModal(false);

            history.go(0);
        }).catch((err) => {
            
            setCommitteeError(err.message);
        });
    }

    const handleDelete = (type, id) => {

        const idInstance = id;
        const tokenInstance = currentUser;

        if(type === 'secretariat') {
            updateCurrentUser(''); // delete session
        }

        axios.delete(`${API_URL}/${type}/${idInstance}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': tokenInstance,
            }
        }).then((res) => {
            if (type === 'secretariat') {
                history.push('/');
            } else {
                setFlaggedId('');
                setFlaggedIdType('');
                history.go(0);
            }

        }).catch((err) => {
            setConfirmError(err.message);
        });

    }

    const handleCommitteeUpdate = (id, name, username, password) => {

        let postBody = {
            committee: name,
            username: username,
            password: password
        }

        axios.post(`${API_URL}/staff/${id}`, postBody, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            setCommitteeEditModal(false);

            history.go(0);
        }).catch((err) => {
            
            setCommitteeError(err.message);
        });
    }

    return (
        <>
            <div className={`modalopen${editModal ? true : false}`}>
                <Navigation />
                <div className='sec-dash'>
                    <div className='sec-dash-inner'>
                        <h1>Dashboard</h1>
                        <div className='account-information'>
                            <h2>Account Information</h2>
                            <div className='information-layout'>
                                <div className='information-item'>
                                    <h4>First Name</h4>
                                    {userData.firstName} (<span onClick={e=>setEditModal('firstName')}>Edit</span>)
                                </div>
                                <div className='information-item'>
                                    <h4>Last Name</h4>
                                    {userData.lastName} (<span onClick={e=>setEditModal('lastName')}>Edit</span>)
                                </div>
                                <div className='information-item'>
                                    <h4>Email</h4>
                                    {userData.email} (<span onClick={e=>setEditModal('email')}>Edit</span>)
                                </div>
                                <div className='information-item'>
                                    <h4>Conference</h4>
                                    {userData.conference} (<span onClick={e=>setEditModal('conference')}>Edit</span>)
                                </div>
                                <div className='information-item danger'>
                                    <h4>Danger Zone</h4>
                                    <span onClick={e=>{setFlaggedId(userData._id); setFlaggedIdType('secretariat')}} className='danger'>
                                        Delete Account
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='committee-accounts'>
                            <h2>Committee Accounts</h2>
                            <div className='accounts-table'>
                                <table>
                                    <tr>
                                        {/* <th>ID</th> */}
                                        <th>Committee</th>
                                        <th>Login Username</th>
                                        <th>Login Passcode</th>
                                        <th className='mitochondria'>Actions</th>
                                    </tr>
                                    {(committeesList) ? displayCommitteeAccounts() : ''}
                                </table>
                            </div>
                            <div className='accounts-actions'>
                                <button onClick={e=>setCommitteeModal(true)}>
                                    Add new committee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            {(editModal) ? ( // Edits to the secretariat profile (not committee accounts)
                <EditModal 
                    fieldName={editModal} 
                    currentUser={userData} 
                    afterStateFN={handleEdit} 
                    closeModalFN={setEditModal} 
                    newValue={editValue} 
                    newValueFn={setEditValue} 
                    error={updateError}
                    errorFn={setUpdateError} />
            ) : ''}
            {(committeeModal) ? ( // Creating a new committee account
                <CommitteeModal 
                    conference={userData.conference}
                    createCommittee={handleCreateCommittee}
                    modalFn={setCommitteeModal}
                    error={committeeError}
                    errorFn={setCommitteeError} />
            ) : ''}
            {(committeeEditModal) ? ( // Edit committee account
                <EditCommitteeModal 
                    id={updateId}
                    idFn={setUpdateId}

                    name={updatedName}
                    nameFn={setUpdatedName}

                    username={updatedUsername}
                    usernameFn={setUpdatedUsername}

                    password={updatedPassword}
                    passwordFn={setUpdatedPassword}

                    modalFn={setCommitteeEditModal}

                    error={editCommitteeError}
                    errorFn={setEditCommitteeError}

                    conference={userData.conference}
                    submit={handleCommitteeUpdate} />
            ) : ''}
            {(flaggedId) ? ( // Delete confirmations
                <ConfirmModal 
                    id={flaggedId}
                    type={flaggedIdType}
                    modalFn={setFlaggedId}
                    error={confirmError}
                    errorFn={setConfirmError}
                    deleteFn={handleDelete} />
            ) : ''}
        </>
    )

}

export default Dashboard;