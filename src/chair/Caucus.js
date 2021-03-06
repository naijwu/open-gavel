import React, { useEffect, useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

import SearchIcon from '../assets/icons/search.svg';

const Caucus = (props) => {

    const handleNullError = () => {
        // do something
        console.log('no countries');
        return [];
    }

    const { getCountries, setCountries, setPushNext, getCaucus, setCaucus } = useCommitteeContext();

    const [caucusExists, setCaucusExists] = useState(false);

    // display countries hooks
    const [displayCountries, setDisplayCountries] = useState([]);
    const [countries, setCountriesList] = useState(getCountries() ? getCountries() : handleNullError());
    const [search, setSearch ] = useState('');
    const [refresh, setRefresh] = useState(true);

    // speaker management hooks
    const [activeSpeaker, setActiveSpeaker] = useState(caucusExists ? (getCaucus() ? (getCaucus().current_speaker ? getCaucus().current_speaker : '') : '') : ''); // hooks OBJECT of the country
   
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedTotalTime, setElapsedTotalTime] = useState(0);

    const [timerID, setTimerID] = useState([]); // use to set/clear interval function
    const [isTicking, setIsTicking] = useState(false); // false if stopped, or before speaking

    const [isExpiredSpeaker, setIsExpiredSpeaker] = useState(false);
    const [isExpiredCaucus, setIsExpiredCaucus] = useState(false);

    const caucusInfo = getCaucus();

    useEffect(() => {
        if(caucusInfo) {
            setCaucusExists(true);
        } else {
            setCaucusExists(false);
        }
    })

    useEffect(() => {
        let display_array = [];

        if(countries.length === 0) {
            display_array.push(
                <div className='speaker-item'>
                    No Countries
                </div>
            )
        }

        if(search) {        
            for(let i = 0; i < countries.length; i++) {
                if(countries[i].presence === 'voting' || countries[i].presence === 'present') {
                    if(countries[i].name.toLowerCase().search(search.toLowerCase()) > -1) {
                        display_array.push(
                            <div key={countries[i]._id} className={`speaker-item ${(activeSpeaker._id === countries[i]._id) ? 'active' : ''}`} onClick={e=>selectedSpeaker(countries[i]._id)}>
                                {countries[i].name}
                            </div>
                        );
                    }
                }
            }
        } else {
            for(let i = 0; i < countries.length; i++) {
                if(countries[i].presence === 'voting' || countries[i].presence === 'present') {
                    display_array.push(
                        <div key={countries[i]._id} className={`speaker-item ${(activeSpeaker._id === countries[i]._id) ? 'active' : ''}`} onClick={e=>selectedSpeaker(countries[i]._id)}>
                            {countries[i].name}
                        </div>
                    );
                }
            }
        }

        setDisplayCountries(display_array);
    }, [search, activeSpeaker._id, countries]);

    const deleteCaucus = () => {
        setCaucusExists(false);
        setCaucus('');
        props.toMotions();
    }


    // timer functions

    let speakerTime = elapsedTime ? elapsedTime : 0;
    let totalTime = elapsedTotalTime ? elapsedTotalTime : 0;

    // garbage cleaner
    useEffect(() => {
        if(!isTicking) {
            for (let i = 0; i < timerID.length; i++ ) {
                clearInterval(timerID[i]);
            }
            setTimerID([]);
            setIsTicking(false);
        } else {                                                console.log('New ticker ', timerID);
        }

    }, [isTicking]);

    // ticker function -- invoked every second
    function tick() {
        totalTime += 1;
        setElapsedTotalTime(totalTime);
        if(totalTime > (caucusInfo.time_total * 60)) {
            expiredCaucus();
        }
        speakerTime += 1;
        if(speakerTime === (caucusInfo.time_speaker * 60)) { // more strict on expiry time than speaker
            expiredSpeaker();
        }
        setElapsedTime(speakerTime);
    }

    // country starts speaking
    function startSpeaking() {
        if(!isTicking) {

            // allowed to speak (not expired)
            if(!isExpiredSpeaker) {

                // is there time to speak (caucus not expired)
                if(!isExpiredCaucus) {
                    setIsTicking(true);
        
                    // only invoke if timer hasn't already started -- or else hell breaks loose, or something like that
                    const timer = setInterval(tick, 1000);
        
                    // hold in array just in case timer gets invoked twice -- must know ID in order to reset all timers
                    let timerIDs = timerID;
                    timerIDs.push(timer)
                    setTimerID(timerIDs);                                       console.log('Ticker started with ID', timer);
                }
    
            }
        }
    }

    // country elapses time
    function pauseSpeaking() {
        if(isTicking) {
            setIsTicking(false);                                        console.log('Ticker stopped, ID', timerID[0]);
        } else {
            console.log('Divided by Zero', timerID)
        }
    }

    function resetSpeaking() {
        let timeToReset = elapsedTime;
        let newElapsedTotalTime = elapsedTotalTime - timeToReset;
        setElapsedTotalTime(newElapsedTotalTime);

        // reset data
        setElapsedTime(0);
        setIsExpiredSpeaker(false);
        if(newElapsedTotalTime < (caucusInfo.time_total * 60)) {
            setIsExpiredCaucus(false);
        }
        
        // stop (all) ticking
        setIsTicking(false);                                            console.log('Reset all');
    }

    // new speaker gets selected
    function selectedSpeaker(id) {

        // check if *actually* new speaker
        if(activeSpeaker ? (activeSpeaker._id !== id) : true) {

            if(activeSpeaker) {
                setPushNext('true');
    
                // save data (speaking statistic)
                let countryToUpdate = countries.find(item=>item._id===activeSpeaker._id); // country to update
                let updateCountry = {
                    ...countryToUpdate,
                    stats_moderated: countryToUpdate.stats_moderated + elapsedTime
                };
                console.log(countryToUpdate.name, elapsedTime);
    
                let updatedCountries = countries;
                updatedCountries.splice(updatedCountries.indexOf(countryToUpdate), 1);
                updatedCountries.push(updateCountry);
                updatedCountries.sort((a, b) => (a.name > b.name) ? 1 : -1);
                
                setCountries(updatedCountries);
            } 

            // clear speaker time
            setIsExpiredSpeaker(false);
            setIsTicking(false);                                            console.log('New speaker selected');
            
            // switch active speaker
            setSearch('');
            setElapsedTime(0);

            // update active speaker on session storage
            let newCaucusInfo = caucusInfo;
            let newCountry = countries.find(item=>item._id===id);
            newCaucusInfo.current_speaker = newCountry;
            setCaucus(newCaucusInfo); 
            setActiveSpeaker(newCaucusInfo.current_speaker);
        }
    }

    function expiredSpeaker () {
        // called when speaker time expires

        setIsTicking(false);
        setIsExpiredSpeaker(true);
    }

    function expiredCaucus () {
        // called when caucus time expires

        setIsTicking(false);
        setIsExpiredCaucus(true);
        setIsExpiredSpeaker(true); // also expire speaker
    }

    function startUnmod() {
        
        if(!isTicking) {
            setActiveSpeaker({});

            // allowed to speak (not expired)
            if(!isExpiredCaucus) {
                setIsTicking(true);
        
                // only invoke if timer hasn't already started -- or else hell breaks loose, or something like that
                const timer = setInterval(tick, 1000);
        
                // hold in array just in case timer gets invoked twice -- must know ID in order to reset all timers
                let timerIDs = timerID;
                timerIDs.push(timer)
                setTimerID(timerIDs);                                       console.log('Ticker started with ID', timer);
    
            }
        }
    }

    function pauseUnmod() {
        if(isTicking) {
            setIsTicking(false);
        }
    }

    function resetUnmod() {
        setElapsedTotalTime(0);
        setIsExpiredCaucus(false);
        setIsTicking(false);
    }

    // option for auto-start speaker timer
    useEffect(() => {

        // option toggle goes here
        if (true) {
            if(activeSpeaker) {
                if(!isTicking) {
                    startSpeaking();
                }
            }
        }
    }, [activeSpeaker._id]);
    

    return caucusExists ? (
        <div className='app-inner'>
            <div className='app-inner-inner'>
                <h1>{caucusInfo.type}</h1>
                <div className='caucus'>

                    <div className='information'>
                        <div className='information-text'>
                            <h3>Topic</h3>
                            {(caucusInfo.type === 'Unmoderated Caucus') ? (
                                <h2>{caucusInfo.time_total}m {caucusInfo.topic}</h2>
                            ) : ''}
                            {(caucusInfo.type === 'Moderated Caucus') ? (
                                <h2>{caucusInfo.time_total} : {caucusInfo.time_speaker} on {caucusInfo.topic}</h2>
                            ) : ''}
                            {(caucusInfo.type === 'Round Table') ? (
                                <h2>{caucusInfo.time_speaker}m {caucusInfo.topic}</h2>
                            ) : ''}

                        </div>
                        <div className='information-timer'>
                            <div className={`elapsed ${(isExpiredCaucus ? 'expired' : '')}`} style={{width: ((elapsedTotalTime) / parseInt(caucusInfo.time_total * 60) * 100) + '%'}}></div>
                        </div>
                    </div>
                    {(caucusInfo.type === 'Moderated Caucus' || caucusInfo.type === 'Round Table') ? (
                    <>
                        <div className='speaker'>
                            {(activeSpeaker) ? (
                                <div className='speaker-inner'>
                                    <div className='flag'>
                                        <img src={`https://www.countryflags.io/${activeSpeaker.country_code}/flat/64.png`} />
                                    </div>
                                    <div className='name'>
                                        {activeSpeaker.name}
                                    </div>
                                    <div className='timer'>
                                        <div className='timer-band'>
                                            <div className={`elapsed ${(isExpiredSpeaker ? 'expired' : '')}`} style={{width: ((elapsedTime) / parseInt(caucusInfo.time_speaker * 60) * 100) + '%'}}></div>
                                        </div>
                                        <div className='timer-text'>
                                            {Math.floor(elapsedTime / 60)} minutes {elapsedTime - Math.floor(elapsedTime / 60) * 60} seconds
                                        </div>
                                    </div>
                                    <div className='options'>
                                        {(!isTicking) ? (
                                            <div className='media-button start' onClick={e=>startSpeaking()}>
                                                Start
                                            </div>
                                        ) : (
                                            <div className='media-button pause' onClick={e=>pauseSpeaking()}>
                                                Stop
                                            </div>
                                        )}
                                        <div className='media-button pause' onClick={e=>resetSpeaking()}>
                                            Reset
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='no-speaker'>
                                    Select a Speaker
                                </div>
                            )}
                        </div>
                        <div className='caucus-action-tray'>
                            <div className='manage-speaker'>
                                <h3>Select Speaker</h3>
                                <div className='speaker-container'>
                                    <div className='speaker-search'>
                                        <img src={SearchIcon} />
                                        <input type="text" value={search} onChange={e=>setSearch(e.target.value.replace(/\\/g, ''))} />
                                    </div>
                                    <div className='speaker-list'>
                                        {displayCountries}
                                    </div>
                                </div>
                            </div>
                            <div className='equalizaaa'>
                                <div className='manage-caucus'>
                                    <h3>Manage Caucus</h3>
                                    <div className='delete-caucus' onClick={e=>deleteCaucus()}>Elapse Caucus</div>
                                </div>
                            </div>
                        </div>
                    </>
                    ) : (
                    // Only for Unmoderated Caucus
                    <>
                        <div className='unmod-time'>
                            <div className='timer-text'>
                                {Math.floor(elapsedTotalTime / 60)} minutes {elapsedTotalTime - Math.floor(elapsedTotalTime / 60) * 60} seconds
                            </div>
                            <div className='options'>
                                {(!isTicking) ? (
                                    <div className='media-button start' onClick={e=>startUnmod()}>
                                        Start
                                    </div>
                                ) : (
                                    <div className='media-button pause' onClick={e=>pauseUnmod()}>
                                        Stop
                                    </div>
                                )}
                                <div className='media-button pause' onClick={e=>resetUnmod()}>
                                    Reset
                                </div>
                            </div>
                        </div>
                        <div className='manage-caucus'>
                            <h3>Manage Caucus</h3>
                            <div className='delete-caucus' onClick={e=>deleteCaucus()}>Elapse Caucus</div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className='app-inner'>
            <div className='app-inner-inner'>
                <h1>Active Caucus</h1>
                <div className='no-caucus'>
                    No Active Caucus
                </div>
            </div>
        </div>
    );
}

export default Caucus;