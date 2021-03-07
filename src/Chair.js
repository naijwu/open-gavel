import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import { useAuthContext } from './authentication/AuthContext';
import { useCommitteeContext } from './contexts/CommitteeContext';
import { API_URL } from './config';
import './OpenGavel.css';

import RollCall from './chair/RollCall';
import RecordMotions from './chair/RecordMotions';
import Speakers from './chair/Speakers';
import Caucus from './chair/Caucus';
import Options from './chair/Options';

import ArrowLeft from './assets/icons/arrow-left.svg';
import Edit from './assets/icons/edit.svg';
import Layers from './assets/icons/layers.svg';
import Users from './assets/icons/users.svg';
import User from './assets/icons/user.svg';
import Settings from './assets/icons/settings.svg';
import Sliders from './assets/icons/sliders.svg';
import LinkOut from './assets/icons/external-link.svg'

const Chair = () => {
    const { initialize, getCountries, getStatistics, setStatistics, setCountries, setPushNext, getPushNext, persist } = useCommitteeContext();
    const { currentUser, getTokenData } = useAuthContext();

    const history = useHistory();

    const [committeeCountries, setCommitteeCountries] = useState([]);
    const [committeeStatistics, setCommitteeStatistics] = useState([]);

    const [component, setComponent] = useState('default'); 
    const [slidOut, setSlidOut] = useState(true); 
    const [slidOutHover, setSlidOutHover] = useState(false); 

    const userData = getTokenData();

    // only at the very beginning
    useEffect(() => {
        
        axios.get(`${API_URL}/committee/${userData.committee_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            // set into session
            let countries = res.data.countries;

            setCommitteeCountries(countries.sort((a, b) => (a.name > b.name) ? 1 : -1));
            setCommitteeStatistics(res.data.statistics);

            initialize({
                countries: countries,
                statistics: res.data.statistics,
                settings: res.data.settings,
            });

        }).catch((err) => {
            console.log(err);
        });

    }, []);

    const handleRollCallUpdates = (country, status) => {
        // makes changes
        setPushNext('true');


        // id: id of country, presence: present/voting/absent (default)

        // handle
        let countryToChange = {
            ...country,
            presence: status
        };

        let updatedCountries = committeeCountries;

        // splice the country to change
        
        updatedCountries.splice(updatedCountries.indexOf(country), 1);

        updatedCountries = [
            ...updatedCountries,
            countryToChange
        ];

        setCountries(updatedCountries);
        setCommitteeCountries(getCountries());
    }

    // exists to persist value to the database
    const persistMiddleware = (next, value) => {

        // check if there is a difference between db state vs this state

        let shouldPush = getPushNext();

        // conditional save (if there are any changes made)
        if (shouldPush === 'true') {
            persist({
                statistics: getStatistics(),
                countries: getCountries(),
            });
        } 

        // now updated
        setPushNext('false');

        // Handle next action
        if (next === 'component') {
            setComponent(value);
        }

        if (next === 'link') {
            history.push('/committee/dashboard');
        }
    }

    const openCaucus = () => {
        persistMiddleware('component', 'active-caucus');
    }

    const elapseCaucus = (data) => {
    
        const { type, duration } = data;

        // if significant caucus
        if(duration > 10) {
            setPushNext('true');
    
            let currentStatistics = getStatistics();
            let newStatistics = {};
    
            if(type === 'Unmoderated Caucus') {
                newStatistics = {
                    ...currentStatistics,
                    unmod_no: (currentStatistics.unmod_no ? parseInt(currentStatistics.unmod_no) : 0) + 1,
                    unmod_seconds: (currentStatistics.unmod_seconds ? parseInt(currentStatistics.unmod_seconds) : 0) + duration,
                };
            } else if (type === 'Moderated Caucus') {
                newStatistics = {
                    ...currentStatistics,
                    mod_no: (currentStatistics.mod_no ? parseInt(currentStatistics.mod_no) : 0) + 1,
                    mod_seconds: (currentStatistics.mod_seconds ? parseInt(currentStatistics.mod_seconds) : 0) + duration,
                };
            } else if (type === 'Round Table') {
                newStatistics = {
                    ...currentStatistics,
                    roundtable_no: (currentStatistics.roundtable_no ? parseInt(currentStatistics.roundtable_no) : 0) + 1,
                    roundtable_seconds: (currentStatistics.roundtable_seconds ? parseInt(currentStatistics.roundtable_seconds) : 0) + duration,
                };
            }
    
            setStatistics(newStatistics);
    
            persistMiddleware('component', 'motions');
        }
    }

    return (
        <div className={`app-container slid${slidOut}`}>
            <div className={`side ${slidOut} hover${slidOutHover}`}>
                <div className='side-inner'>
                    <div className='tabs' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'rollcall') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'rollcall')}>
                                <img src={Users} />
                                Roll Call
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'speakers') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'speakers')}>
                              <img src={User} />
                                Speakers
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'motions') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'motions')}>
                                <img src={Edit} />
                                Motions
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'active-caucus') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'active-caucus')}>
                                <img src={Layers} />
                                Active Caucus
                            </div>
                        </div>
                    </div>
                    <div className='whitespace'>

                    </div>
                    <div className='utility' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='utility-text' onClick={e => persistMiddleware('component', 'options')}>
                            <img src={Settings} />
                            Program Options
                        </div>
                        <div className='utility-text external' onClick={e=>persistMiddleware('link', '/committee/dashboard')}>
                            <img src={Sliders} />
                            <div className='internetspace'>Dashboard</div>
                            <img className='mini-icon' src={LinkOut} />
                        </div>
                        <div className='utility-text' onClick={e=>setSlidOut((slidOut) ? false : true)}>
                            <img className='arrow' src={ArrowLeft} />
                            {(slidOut) ? (
                                <>
                                    Hide Panel
                                </>
                            ) : (
                                <>
                                    Hiding!
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='app-main'>
                {(component === 'default') ? (
                    <div className='centre-stamp'>
                        OpenGavel
                    </div>
                ): ''}
                {(component === 'rollcall') ? (
                    <RollCall
                        countries={committeeCountries}
                        updateCountry={handleRollCallUpdates} />
                ): ''}
                {(component === 'motions') ? (
                    <RecordMotions
                        toCaucus={openCaucus} />
                ): ''}
                {(component === 'speakers') ? (
                    <Speakers />
                ): ''}
                {(component === 'active-caucus') ? (
                    <Caucus
                        elapseCaucus={elapseCaucus} />
                ): ''}
                {(component === 'options') ? (
                    <Options />
                ): ''}
            </div>
        </div>
    )
}

export default Chair;