import React, { useEffect, useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

const Speakers = (props) => {

    const { getSettings, getCountries } = useCommitteeContext();

    const [ presentCountries, setPresentCountries ] = useState([]);
    const [ screen, setScreen ] = useState(getSettings() ? getSettings().default_speaker_screen : '');

    const [activeSpeaker, setActiveSpeaker] = useState({});
    const [time, setTime] = useState(0);
    const [speakersList, setSpeakersList] = useState(sessionStorage.getItem('speakersData') ? JSON.parse(sessionStorage.getItem('speakersData')).list : []);

    const [displayCountries, setDisplayCountries] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const [selectedSpeakers, setSelectedSpeakers] = useState([]);

    const [showRemove, setShowRemove] = useState(false);
    const [showStart, setShowStart] = useState(speakersList ? ((speakersList.length > 0) ? true : false) : false);
    const [started, setStarted] = useState(false);

    const [timerID, setTimerID] = useState([]); // use to set/clear interval function
    const [ticking, setTicking] = useState(false);

    const max = 60;

    // update present/present & voting countries
    useEffect(() => {
        let countries = getCountries();
        if(countries) {
            let available = [];
            available = countries.filter((item) => (item.presence ==='voting' || item.presence === 'present'));
            setPresentCountries(available);
        }
    }, []);

    useEffect(() => {
        if(screen === 'Primary') {
            sessionStorage.setItem('speakerScreen', 'Primary');
        } else if (screen === 'Secondary') {
            sessionStorage.setItem('speakerScreen', 'Secondary');
        } else if (screen === 'Single') {
            sessionStorage.setItem('speakerScreen', 'Single');
        } else {
            sessionStorage.removeItem('speakerScreen');
        }
    } , [screen])

    // update countries display
    useEffect(() => {
        let return_val = [];

        for(let i = 0; i < presentCountries.length; i++) {
            return_val.push(
                <div className='country-to-add' onClick={e=>handleAddToList(presentCountries[i]._id)}>
                    {presentCountries[i].name}
                </div>
            )
        }

        setDisplayCountries(return_val);
    }, [presentCountries, refresh]);

    // update countries list (after added from countries display above)
    useEffect(() => {
        let return_val = [];

        for (let i = 0; i < speakersList.length; i++) {
            return_val.push(
                <div className={`country-in-list ${speakersList[i]._id}`} onClick={e=>handleToggleSelect(speakersList[i]._id)}>
                    {speakersList[i].name}
                </div>
            )
        }

        setDisplayList(return_val);
    }, [speakersList, refresh]);

    function triggerRefresh() {
        setRefresh(refresh ? false : true);
    }

    function handleAddToList(country_id) {
        if(!started) {
            let newList = speakersList;
    
           // check if allowed action
            let found = false;
            for(let i = 0; i < speakersList.length; i++) {
                if (speakersList[i]._id == country_id) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                let country = presentCountries.filter(item=>item._id===country_id)[0];
                newList.push(country);
            }
            
            setShowStart(true);
            setSpeakersList(newList);
            triggerRefresh();
        }
        saveState();
    }

    function handleRemoveSelected() {
        let newList = speakersList;

        for(let i = 0; i < selectedSpeakers.length; i++) {
            newList.splice(newList.indexOf(presentCountries.filter(item=>item._id===selectedSpeakers[i])[0]), 1);
        }

        if(newList.length === 0) {
            setShowStart(false);
            setShowRemove(false);
        }
        setSelectedSpeakers([]);
        setSpeakersList(newList);
        triggerRefresh();
        saveState();
    }

    function handleRemoveAll() {
        setSpeakersList([]);
        setSelectedSpeakers([]);
        setShowStart(false);
        setShowRemove(false);
        triggerRefresh();
    }

    function handleToggleSelect(country_id) {
        if(!started) {
            let newSelected = selectedSpeakers;
            
            if(!selectedSpeakers.includes(country_id)) {
                newSelected.push(country_id);
    
                let selected = document.getElementsByClassName(country_id);
                selected[0].classList.add('selected');
            } else {
                newSelected.splice(selectedSpeakers.indexOf(country_id), 1);
    
                let selected = document.getElementsByClassName(country_id);
                selected[0].classList.remove('selected');
            }
    
            if(newSelected.length > 0) {
                setShowRemove(true);
            } else {
                setShowRemove(false);
            }
            
            setSelectedSpeakers(newSelected);
            triggerRefresh();
        }
    }
    
    // timer cleaner
    useEffect(() => {
        if(!ticking) {
            for (let i = 0; i < timerID.length; i++ ) {
                clearInterval(timerID[i]);
            }
            setTimerID([]);
        }
    }, [ticking]);

    let timeElapsed = time ? time : 0;

    // ticker function -- invoked every second
    function tick() {
        timeElapsed += 1;
        setTime(timeElapsed);
        if(timeElapsed === max) {
            speakingPause();
        }
    }

    function saveState() {
        let data = {
            time: timeElapsed.toString(),
            active: activeSpeaker,
            list: speakersList,
        };

        props.setDataStringy(JSON.stringify(data));
        sessionStorage.setItem('speakersData', JSON.stringify(data));
    }

    useEffect(() => {
        saveState();
    }, [speakersList, activeSpeaker, timeElapsed]);

    function startTick() {
        const timer = setInterval(tick, 1000);
        let timerIDs = timerID;
        timerIDs.push(timer);
        setTimerID(timerIDs);
    }

    function speakingStart() {
        // add activeSpeaker const, start timer
        setActiveSpeaker(speakersList[0]);
        
        if(timerID.length === 0) {
            startTick();
        }
    }

    function speakingFinished() {
        // not last speaker -- splice current speaker off of speaker list, go to next speaker
        let list = speakersList;
        list.splice(0, 1);
        setActiveSpeaker(speakersList[0]);

        if(list.length === 0) {
            handleStop();
            setShowStart(false);
        }
        triggerRefresh();
        setTicking(false);
        setTime(0);
    }

    function speakingPause() {
        setTicking(false);
    }

    function speakingResume() {
        if(timeElapsed < max) {
            setTicking(true);
            startTick();
        }
    }

    function speakingReset() {
        setTicking(false);
        setTime(0);
    }

    function handleStart() {
        setStarted(true);
        setTicking(true);
        speakingStart();
        triggerRefresh();
    }

    function handleStop() {
        setTime(0);
        setStarted(false);
        setTicking(false);
        triggerRefresh();
        setActiveSpeaker([]);
    }

    return (
        <div className='app-inner'>
            <div className='app-inner-inner speakers'>
                <div className='one-liner'>
                    <h1>Speakers</h1>
                    <div className='speaker-lists'>
                        <div className={`speaker-type ${(screen === 'Primary') ? 'active' : ''}`} onClick={e=>setScreen('Primary')}>Primary</div>
                        <div className={`speaker-type ${(screen === 'Secondary') ? 'active' : ''}`} onClick={e=>setScreen('Secondary')}>Secondary</div>
                        <div className={`speaker-type ${(screen === 'Single') ? 'active' : ''}`} onClick={e=>setScreen('Single')}>Single</div>
                    </div>
                </div>
                <div className='speakers-inner'>
                {(screen === 'Primary') ? (
                    <div className='primary-list'>
                        <h2>Primary Speakers List</h2>
                        <div className='speakers-wrap'>
                            <div className='speakers-container'>
                                {(activeSpeaker) ? ((activeSpeaker.name) ? (
                                    <>
                                        <div className='speaker'>
                                            {activeSpeaker.name}
                                        </div>
                                        <div className='speaker-timer'>
                                            {time}/60
                                        </div>
                                        <div className='speaker-action'>
                                            {(ticking) ? (
                                                <div className='button' onClick={e=>speakingPause()}>
                                                    Pause
                                                </div>
                                            ) : (
                                                <div className='button' onClick={e=>speakingResume()}>
                                                    Resume
                                                </div>
                                            )}
                                            <div className='button' onClick={e=>speakingReset()}>
                                                Reset Time
                                            </div>
                                            <div className='button' onClick={e=>{triggerRefresh(); speakingFinished()}}>
                                                Next
                                            </div>
                                        </div>
                                    </>
                                ) : 'Speaker List Inactive') : 'Speaker List Inactive'}
                            </div>
                            <div className={`speakers-bot ${started ? 'speaking' : ''}`}>
                                <div className={`speakers-add ${started ? 'disabled' : ''}`}>
                                    <h3>Add Speakers</h3>
                                    {displayCountries}
                                </div>
                                <div className='speakers-list'>
                                    <h3>Speaker List</h3>
                                    {displayList}
                                    {(showRemove) ? (
                                        (started) ? '' : (
                                            <div className='remove' onClick={e=>handleRemoveSelected()}>
                                                Remove
                                            </div>
                                        )
                                    ) : ''}
                                </div>
                                <div className='speakers-manage'>
                                    <h3>Manage Speeches</h3>
                                    <div className='manage-field'>
                                        {(showStart) ? (
                                            (started) ? (
                                                <div className='start' onClick={e=>handleStop()}>
                                                    Stop
                                                </div>
                                            ) : (
                                                <div className='start' onClick={e=>handleStart()}>
                                                    Start
                                                </div>
                                            )
                                        ) : ''}
                                        {(showStart) ? (
                                            (started) ? '' : (
                                                <div className='button' onClick={e=>handleRemoveAll()}>
                                                    Clear List
                                                </div>
                                            )
                                        ) : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ''}
                {(screen === 'Secondary') ? (
                    <div className='secondary-list'>
                        <h2>Secondary Speakers List</h2>
                    </div>
                ) : ''}
                {(screen === 'Single') ? (
                    <div className='single-list'>
                        <h2>Single Speaker</h2>
                    </div>
                ) : ''}
                {(!screen) ? (
                    'Select a speaker list'
                ) : ''}
                </div>
            </div>
        </div>
    );
}

export default Speakers;