import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import { useCommitteeContext } from './contexts/CommitteeContext';
import './OpenGavel.css';
import isEqual from 'underscore/modules/isEqual'

import RollCall from './chair/RollCall';
import RecordMotions from './chair/RecordMotions';
import Speakers from './chair/Speakers';
import Caucus from './chair/Caucus';

import ArrowLeft from './assets/icons/arrow-left.svg';
import Edit from './assets/icons/edit.svg';
import Layers from './assets/icons/layers.svg';
import Users from './assets/icons/users.svg';
import User from './assets/icons/user.svg';
import Settings from './assets/icons/settings.svg';
import Sliders from './assets/icons/sliders.svg';

const Chair = () => {
    const { initialize, getCountries, getStatistics, setStatistics, setCountries, persist } = useCommitteeContext();

    const history = useHistory();

    const [committeeCountries, setCommitteeCountries] = useState([]);
    const [committeeStatistics, setCommitteeStatistics] = useState([]);

    const [component, setComponent] = useState('default'); 
    const [slidOut, setSlidOut] = useState(true); 
    const [slidOutHover, setSlidOutHover] = useState(false); 


    useEffect(() => {

        initialize();

        setCommitteeCountries(getCountries());
        setCommitteeStatistics(getStatistics());


    }, []);

    const handleRollCallUpdates = (country, status) => {
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
        // persist({
        //     statistics: committeeStatistics,
        //     countries: committeeCountries,
        // });

        // TODO: Conditional save (if initial vs current session data is different)
    

        // Handle next action
        if (next === 'component') {
            setComponent(value);
        }

        if (next === 'link') {
            history.push('/committee/dashboard');
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
                            <div className={`tab-text ${(component === 'motions') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'motions')}>
                                <img src={Edit} />
                                Motions
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'speakers') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'speakers')}>
                              <img src={User} />
                                Speakers
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
                        <div className='utility-text'>
                            <img src={Settings} />
                            Program Options
                        </div>
                        <div className='utility-text' onClick={e=>persistMiddleware('link', '/committee/dashboard')}>
                            <img src={Sliders} />
                            Dashboard
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

            {/* Need to have OGContext here (for committee states) */}
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
                    <RecordMotions />
                ): ''}
                {(component === 'speakers') ? (
                    <Speakers />
                ): ''}
                {(component === 'active-caucus') ? (
                    <Caucus />
                ): ''}
            </div>
        </div>
    )
}

export default Chair;