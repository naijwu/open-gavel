import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation';
import { useAuthContext } from './authentication/AuthContext';
import { API_URL } from './config';
import Footer from './components/Footer';

const Dashboard = () => {
    const { currentUser, getTokenData } = useAuthContext();

    const [committeesList, setCommitteesList] = useState();
    const [userData, setUserData] = useState(getTokenData());

    useEffect(() => {

        axios.get(`${API_URL}/staff/${getTokenData().conference}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            setCommitteesList(res.data);
        }).catch((err) => {
            setCommitteesList(err);
        });

    }, [])

    const displayCommitteeAccounts = () => {
        let displayArray = [];

        if (committeesList.length === 0) {
            return (
                <tr>
                    <div className='empty-table'>
                        Wow, so empty!
                    </div>
                </tr>
            )
        }

        committeesList.forEach((item) => {
            displayArray.push(
                <tr>
                    <th>{item.id}</th>
                    <th>{item.committee}</th>
                    <th>{item.username}</th>
                    <th>{item.passcode}</th>
                </tr>
            )
        });

        return displayArray;
    }

    return (
        <>
            <Navigation />
            <div className='sec-dash'>
                <div className='sec-dash-inner'>
                    <h1>Dashboard</h1>
                    <div className='account-information'>
                        <h2>Account Information</h2>
                        <div className='information-layout'>
                            <h4>First Name</h4>
                            {userData.firstName} (<a href='#'>Edit</a>)<br /><br />
                            <h4>Last Name</h4>
                            {userData.lastName} (<a href='#'>Edit</a>)<br /><br />
                            <h4>Email</h4>
                            {userData.email} <br /><br />
                            <h4>Conference</h4>
                            {userData.conference} (<a href='#'>Edit</a>)<br /><br />
                            <a href='#'>
                                Delete Account
                            </a>
                        </div>
                    </div>
                    <div className='committee-accounts'>
                        <h2>Committee Accounts</h2>
                        <div className='accounts-table'>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>Committee Name</th>
                                    <th>Username</th>
                                    <th>Passcode</th>
                                    <th>Actions</th>
                                </tr>
                                {(committeesList) ? displayCommitteeAccounts() : ''}
                            </table>
                        </div>
                        <div className='accounts-actions'>
                            <button>
                                Add new committee
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )

}

export default Dashboard;