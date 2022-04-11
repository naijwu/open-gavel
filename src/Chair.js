import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import { useAuthContext } from './authentication/AuthContext';
import { useCommitteeContext } from './contexts/CommitteeContext';
import { API_URL } from './config';
import './OpenGavel.css';
import NewWindow from 'react-new-window';

import RollCall from './chair/RollCall';
import RecordMotions from './chair/RecordMotions';
import Speakers from './chair/Speakers';
import Caucus from './chair/Caucus';
import Options from './chair/Options';

const displaySwitchboard = {
    'Blank': 'default',
    'Roll Call': 'rollcall',
    'Speakers': 'speakers',
    'Motions': 'motions',
    'Active Caucus': 'active-caucus',
};

const Chair = () => {
    
    const { initialize, getMotionsList, getCountries, getStatistics, setStatistics, setCountries, setPushNext, getPushNext, getSettings, getPresenting, setPresenting, setCurrentPage, persist } = useCommitteeContext();
    const { currentUser, getTokenData } = useAuthContext();

    const [isPresenting, setIsPresenting] = useState(getPresenting() ? getPresenting() : false);

    const [motions, setMotions] = useState({});
    const [motionsStringified, setMotionsStringified] = useState(getMotionsList() ? JSON.stringify(getMotionsList()) : JSON.stringify(
        {
            uuid: {
                type: 'Moderated Caucus',
                total: '',
                speaking: '',
                topic: ''
            }
        }
    )); // pres mode

    const [speakersData, setSpeakersData] = useState({});
    const [speakersStringified, setSpeakersStringified] = useState(''); // pres mode
    
    const [caucusData, setCaucusData] = useState({});
    const [caucusStringified, setCaucusStringified] = useState(''); // pres mode

    const history = useHistory();
    const userData = getTokenData();

    const [committeeCountries, setCommitteeCountries] = useState([]);
    const [committeeStatistics, setCommitteeStatistics] = useState([]);

    const [component, setComponent] = useState(getSettings() ? displaySwitchboard[getSettings().default_start_screen] : 'default'); 
    const [slidOut, setSlidOut] = useState((getSettings() ? getSettings().default_drawer_position === 'Opened' : true) ? true : false); 
    const [slidOutHover, setSlidOutHover] = useState(false); 

    const [settingRefresh, setSettingRefresh] = useState(true);

    const [isDarkMode, setIsDarkMode] = useState(getSettings() ? getSettings().dark_mode === 'true' : false);



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
            let statistics = res.data.statistics;
            let settings = res.data.settings;
            
            setCommitteeCountries(countries.sort((a, b) => (a.name > b.name) ? 1 : -1));
            setCommitteeStatistics(statistics);
            initialize({
                countries: countries,
                statistics: statistics,
                app_settings: settings,
            });

        }).catch((err) => {
            console.log(err);
        });

    }, []);

    useEffect(() => {
        // dyanmically changing settings (drawer pos. and dark mode -- other option changes don't go here since their changes can't be instantly seen)
        setSlidOut(getSettings().default_drawer_position === 'Opened');
        setIsDarkMode(getSettings().dark_mode === 'true');
    }, [settingRefresh]);

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

    const pageSwitchboard = {
        'rollcall': 'Roll Call',
        'speakers': 'Speakers',
        'motions': 'Motions',
        'active-caucus': 'Active Caucus',
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
                settings: getSettings(),
            });
        } 

        // now updated
        setPushNext('false');

        // Handle next action
        if (next === 'component') {
            setComponent(value);
            setCurrentPage(pageSwitchboard[value]);
        }

        if (next === 'link') {
            history.push('/committee/dashboard');
        }
    }

    const openCaucus = () => {
        persistMiddleware('component', 'active-caucus');
    }

    const openOptions = () => {
        persistMiddleware('component', 'options');
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

    function handleSaveSettings(data) {
        setSettingRefresh(settingRefresh ? false : true);
        persist({
            statistics: getStatistics(),
            countries: getCountries(),
            settings: getSettings(),
        });
    }

    function handleTogglePresentation() {
        if(isPresenting) {
            // already presenting -- need to stop presenting
            setIsPresenting(false);
            setPresenting(false);
        } else {
            setIsPresenting(true);
            setPresenting(true);
        }
    }




    const [displayCountriesPresentation, setDisplayCountriesPresentation] = useState([]);

    useEffect(() => {
        if(motionsStringified) {
            setMotions(JSON.parse(motionsStringified));
        } 

        if(speakersStringified) {
            setSpeakersData(JSON.parse(speakersStringified));
        }

        if(caucusStringified) {
            setCaucusData(JSON.parse(caucusStringified));
        }

    }, [motionsStringified, speakersStringified, caucusStringified]);

    useEffect(() => {
        let return_arr = [];


        for (let i = 0; i < committeeCountries.length; i++) {
            return_arr.push(
                <div className='present-country'>
                    <div className='present-country-name'>
                        {committeeCountries[i].name} 
                    </div>
                    <div className={`present-country-presence ${committeeCountries[i].presence ? committeeCountries[i].presence : 'absent'}`}>
                        {((committeeCountries[i].presence === 'absent') || (committeeCountries[i].presence === '')) ? 'Absent' : ''}
                        {(committeeCountries[i].presence === 'present') ? 'Present' : ''}
                        {(committeeCountries[i].presence === 'voting') ? 'Present & Voting' : ''}
                    </div>
                </div>
            )
        }


        setDisplayCountriesPresentation(return_arr);

    }, [committeeCountries])

    return (
        <div className={`app-container slid${slidOut} dm${isDarkMode}`}>
            <div className={`side ${slidOut} hover${slidOutHover} presenting${isPresenting}`}>
                <div className='side-inner'>
                    <div className='tabs' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'rollcall') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'rollcall')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                Roll Call
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'speakers') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'speakers')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Speakers
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'motions') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'motions')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                Motions
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'active-caucus') ? 'active' : ''}`} onClick={e => persistMiddleware('component', 'active-caucus')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                                Active Caucus
                            </div>
                        </div>
                    </div>
                    <div className='whitespace'>

                    </div>
                    <div className='utility' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='utility-text' onClick={e=>{handleTogglePresentation()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                            {(isPresenting) ? 'Stop Presenting' : 'Start Presenting'}
                        </div>
                        <div className='utility-text' onClick={e => persistMiddleware('component', 'options')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Program Options
                        </div>
                        <div className='utility-text external' onClick={e=>persistMiddleware('link', '/committee/dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                            <div className='internetspace'>Dashboard</div>
                            <svg className='mini-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" ><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                        <div className='utility-text' onClick={e=>setSlidOut((slidOut) ? false : true)}>
                            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
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

            {(isPresenting) ? (
                <NewWindow
                  title="Open Gavel"
                  onBlock={()=>alert('You must enable window pop-ups to start Presentation Mode')}>
                    <div className='present-container'>
                    {(sessionStorage.getItem('currentPage') === 'Roll Call') ? (
                        <div className='present-wrapper'>
                            <h2>Roll Call</h2>
                            <div className='present-list'>
                                {displayCountriesPresentation}
                            </div>
                        </div>
                    ) : ''}
                    {(sessionStorage.getItem('currentPage') === 'Motions') ? (
                        <div className='present-wrapper'>
                            <h2>Motions</h2>
                            <div className='present-motions'>
                                {JSON.stringify(motions)}
                            </div>
                        </div>
                    ) : ''}
                    {(sessionStorage.getItem('currentPage') === 'Active Caucus') ? (
                        <div className='present-wrapper'>
                            <h2>Active Caucus</h2>
                            {JSON.stringify(caucusData)}
                        </div>
                    ) : ''}
                    {(sessionStorage.getItem('currentPage') === 'Speakers') ? (
                        <div className='present-wrapper'>
                            <h2>Speakers</h2>
                            {JSON.stringify(speakersData)}
                        </div>
                    ) : ''}
                    </div>
                </NewWindow>
            ) : ''}

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
                        setMotions={setMotions}
                        setMotionsStringy={setMotionsStringified}
                        toCaucus={openCaucus}
                        toOptions={openOptions} />
                ): ''}
                {(component === 'speakers') ? (
                    <Speakers
                        setDataStringy={setSpeakersStringified} />
                ): ''}
                {(component === 'active-caucus') ? (
                    <Caucus
                        setDataStringy={setCaucusStringified}
                        elapseCaucus={elapseCaucus} />
                ): ''}
                {(component === 'options') ? (
                    <Options
                        pushSettings={handleSaveSettings} />
                ): ''}
            </div>
        </div>
    )
}

export default Chair;