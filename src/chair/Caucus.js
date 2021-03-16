import React, { useEffect, useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

import SearchIcon from '../assets/icons/search.svg';

const Caucus = (props) => {

    const handleNullError = () => {
        // do something
        console.log('no countries');
        return [];
    }

    const { getCountries, setCountries, setPushNext, getCaucus, setCaucus, getSettings } = useCommitteeContext();

    const caucusInfo = getCaucus();

    const [caucusExists, setCaucusExists] = useState(false);

    // display countries hooks
    const [displayCountries, setDisplayCountries] = useState([]);
    const [countries, setCountriesList] = useState(getCountries() ? getCountries() : handleNullError());
    const [search, setSearch ] = useState('');
    const [refresh, setRefresh] = useState(true);

    // speaker management hooks
    const [activeSpeaker, setActiveSpeaker] = useState(''); // hooks OBJECT of the country
   
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedTotalTime, setElapsedTotalTime] = useState(0);

    const [timerID, setTimerID] = useState([]); // use to set/clear interval function
    const [isTicking, setIsTicking] = useState(false); // false if stopped, or before speaking

    const [isExpiredSpeaker, setIsExpiredSpeaker] = useState(false);
    const [isExpiredCaucus, setIsExpiredCaucus] = useState(false);

    const [nextExists, setNextExists] = useState(true);
    const [previousExists, setPreviousExists] = useState(true);

    // update activespeaker from sessionstore
    useEffect(() => {
        if(caucusInfo) {
            if(typeof caucusInfo.current_speaker !== 'undefined') {
                if(caucusInfo.current_speaker._id) {
                    setActiveSpeaker(caucusInfo.current_speaker);
                }
            }
        }
    }, [caucusExists])

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
                <div className='speaker-item' key={0}>
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
    }, [search, activeSpeaker._id, countries, elapsedTime]);

    const elapseCaucus = (type, duration) => {
        sessionStorage.removeItem('caucusData');
        props.setDataStringy('');

        if(activeSpeaker) {
            setPushNext('true');

            // save data (speaking statistic)
            let countryToUpdate = countries.find(item=>item._id===activeSpeaker._id); // country to update
            let updateCountry = {
                ...countryToUpdate,
                stats_moderated: parseInt(countryToUpdate.stats_moderated) + elapsedTime
            };

            let updatedCountries = countries;
            updatedCountries.splice(updatedCountries.indexOf(countryToUpdate), 1);
            updatedCountries.push(updateCountry);
            updatedCountries.sort((a, b) => (a.name > b.name) ? 1 : -1);
            
            setCountries(updatedCountries);
        } 
        
        setCaucusExists(false);
        setCaucus('');
        props.elapseCaucus({type, duration});
    }


    // timer functions

    var speakerTime = elapsedTime ? elapsedTime : 0;
    var totalTime = elapsedTotalTime ? elapsedTotalTime : 0;

    // garbage cleaner
    useEffect(() => {
        if(!isTicking) {
            for (let i = 0; i < timerID.length; i++ ) {
                clearInterval(timerID[i]);
            }
            setTimerID([]);
            setIsTicking(false);
        } else {
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
        setElapsedTime(speakerTime);
        if(speakerTime === (caucusInfo.time_speaker * 60)) { // more strict on expiry time than speaker
            expiredSpeaker();
        }
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
                    setTimerID(timerIDs);
                }
    
            }
        }
    }

    // country elapses time
    function pauseSpeaking() {
        if(isTicking) {
            setIsTicking(false);
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
        setIsTicking(false);
    }

    // JANKY code -- not sure what it does but im scared of deleting it
    useEffect(() => {
        setElapsedTime(0);
        speakerTime = 0;
    }, [refresh]);

    // update sessionStorage for presentation mode
    useEffect(() => {
        let caucusData = {
            active: activeSpeaker,
            speakerTime: speakerTime,
            totalTime: totalTime,
        }

        if(sessionStorage.getItem('presenting') ? (sessionStorage.getItem('presenting') === 'yes') : false) {
            sessionStorage.setItem('caucusData', JSON.stringify(caucusData));
            props.setDataStringy(JSON.stringify(caucusData));
        }

    }, [activeSpeaker, speakerTime, totalTime]);

    // invoked when new speaker gets selected
    function selectedSpeaker(id) {

        // check if *actually* new speaker
        if(activeSpeaker ? (activeSpeaker._id !== id) : true) {

            if(activeSpeaker) {
                setPushNext('true');

                // save data (speaking statistic)
                let countryToUpdate = countries.find(item=>item._id===activeSpeaker._id); // country to update
                let updateCountry = {
                    ...countryToUpdate,
                    stats_moderated: parseInt(countryToUpdate.stats_moderated) + elapsedTime
                };
    
                let updatedCountries = countries;
                updatedCountries.splice(updatedCountries.indexOf(countryToUpdate), 1);
                updatedCountries.push(updateCountry);
                updatedCountries.sort((a, b) => (a.name > b.name) ? 1 : -1);
                
                setCountries(updatedCountries);
            } 

            // clear speaker time
            setIsExpiredSpeaker(false);
            setIsTicking(false);
            
            // switch active speaker
            setSearch('');
            setRefresh(refresh ? false : true);

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
                setTimerID(timerIDs);
    
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
    
    function getPresentCountries() {
        let presentCountries = [];

        // TODO: Refactor code to make more efficient
        for (let j = 0; j < countries.length; j++) {
            if(countries[j].presence === 'voting' || countries[j].presence === 'present') {
                presentCountries.push(countries[j]);
            }
        }

        return presentCountries;
    }

    function nextSpeaker() {
        let nextSpeakerIndex;
        let presentCountries = getPresentCountries();
        
        for(let i = 0; i < presentCountries.length; i++) {
            if(presentCountries[i]._id === activeSpeaker._id) {
                nextSpeakerIndex = i + 1;
                break;
            }
        }

        if((nextSpeakerIndex + 1) === presentCountries.length) {
            // if the very last item
            setNextExists(false);
        }

        selectedSpeaker(presentCountries[nextSpeakerIndex]._id);
    }

    function previousSpeaker() {
        let previousSpeakerIndex;
        let presentCountries = getPresentCountries();
        
        for(let i = 0; i < presentCountries.length; i++) {
            if(presentCountries[i]._id === activeSpeaker._id) {
                previousSpeakerIndex = i - 1;
                break;
            }
        }

        if((previousSpeakerIndex + 1) === presentCountries.length) {
            // if the very last item
            setNextExists(false);
        }

        selectedSpeaker(presentCountries[previousSpeakerIndex]._id);
    }

    // option for auto-start speaker timer
    useEffect(() => {

        // option toggle goes here
        if (getSettings() ? ((getSettings().auto_start_speaker_timer === 'true') ? true : false) : false) {
            if(activeSpeaker) {
                if(!isTicking) {
                    startSpeaking();
                }
            }
        }


        if(caucusExists) {

            // Round table 'next speaker' functions
            if(caucusInfo.type === 'Round Table') {
                let nextSpeakerIndex;
                let previousSpeakerIndex;
                let presentCountries = getPresentCountries();
                
                for(let i = 0; i < presentCountries.length; i++) {
                    if(presentCountries[i]._id === activeSpeaker._id) {
                        nextSpeakerIndex = i + 1;
                        previousSpeakerIndex = i - 1;
                        break;
                    }
                }
        
                if(nextSpeakerIndex === presentCountries.length) {
                    // if the very last item
                    setNextExists(false);
                } else {
                    setNextExists(true);
                }
                if (previousSpeakerIndex === -1) {
                    setPreviousExists(false);
                } else {
                    setPreviousExists(true);
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
                        {(!(caucusInfo.type === 'Round Table')) ? (
                        <div className='information-timer'>
                            <div className={`elapsed ${(isExpiredCaucus ? 'expired' : '')}`} style={{width: ((elapsedTotalTime) / parseInt(caucusInfo.time_total * 60) * 100) + '%'}}></div>
                        </div>
                        ) : ''}
                    </div>
                    {(caucusInfo.type === 'Moderated Caucus' || caucusInfo.type === 'Round Table') ? (
                    <>
                        <div className='speaker'>
                            {(activeSpeaker) ? (
                                <div className='speaker-inner'>
                                    <div className='country'>
                                        <div className='flag'>
                                            <img src={`https://www.countryflags.io/${activeSpeaker.country_code}/flat/64.png`} />
                                        </div>
                                        <div className='name'>
                                            <h2>{activeSpeaker.name}</h2>
                                        </div>
                                    </div>
                                    <div className='timer'>
                                        <div className='timer-band'>
                                            <div className={`elapsed ${(isExpiredSpeaker ? 'expired' : '')}`} style={{width: ((elapsedTime) / parseInt(caucusInfo.time_speaker * 60) * 100) + '%'}}></div>
                                        </div>
                                    </div>
                                    <div className='country-actions'>
                                        <div className='timer-text'>
                                            {Math.floor(elapsedTime / 60)} minutes {elapsedTime - Math.floor(elapsedTime / 60) * 60} seconds
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
                                            {((caucusInfo.type === 'Round Table') && (previousExists)) ? (
                                            <div className='media-button pause' onClick={e=>previousSpeaker()}>
                                                Previous
                                            </div>
                                            ) : ''}
                                            {((caucusInfo.type === 'Round Table') && (nextExists)) ? (
                                            <div className='media-button pause' onClick={e=>nextSpeaker()}>
                                                Next
                                            </div>
                                            ) : ''}
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
                                <h3>
                                    {(caucusInfo.type === 'Round Table') ? 'Speakers List' : 'Select Speaker'}
                                </h3>
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
                                    <div className='delete-caucus' onClick={e=>elapseCaucus((caucusInfo.type === 'Round Table') ? 'Round Table' : 'Moderated Caucus', elapsedTotalTime)}>Elapse Caucus</div>
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
                            <div className='delete-caucus' onClick={e=>elapseCaucus('Unmoderated Caucus', elapsedTotalTime)}>Elapse Caucus</div>
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