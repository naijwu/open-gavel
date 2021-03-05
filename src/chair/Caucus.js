import React, { useEffect, useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

const Caucus = (props) => {

    const handleNullError = () => {
        // do something
        console.log('no countries');
        return [];
    }

    const { getCountries, getCaucus, setCaucus } = useCommitteeContext();

    const [caucusExists, setCaucusExists] = useState(false);

    // display countries hooks
    const [displayCountries, setDisplayCountries] = useState([]);
    const [countries, setCountries] = useState(getCountries() ? getCountries() : handleNullError());
    const [search, setSearch ] = useState('');
    const [refresh, setRefresh] = useState(true);

    // speaker management hooks
    const [activeSpeaker, setActiveSpeaker] = useState(getCaucus().current_speaker.name ? (getCaucus().current_speaker ? getCaucus().current_speaker : '') : ''); // hooks OBJECT of the country
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedTotalTime, setElapsedTotalTime] = useState(0);
    const [speakerStatus, setSpeakerStatus] = useState('');

    const caucusInfo = getCaucus();

    const selectedSpeaker = (id) => {
        // switch active speaker
        setSearch('');
        setElapsedTime(0);
        clearTimeout(speakerTimer);

        let newCaucusInfo = caucusInfo;
        newCaucusInfo.current_speaker = countries.find(item=>item._id===id);

        setCaucus(newCaucusInfo);
        setActiveSpeaker(newCaucusInfo.current_speaker);
    }

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
                            <div key={countries[i]._id} className='speaker-item' onClick={e=>selectedSpeaker(countries[i]._id)}>
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
                        <div key={countries[i]._id} className='speaker-item' onClick={e=>selectedSpeaker(countries[i]._id)}>
                            {countries[i].name}
                        </div>
                    );
                }
            }
        }

        setDisplayCountries(display_array);
    }, [search]);

    const deleteCaucus = () => {
        setCaucusExists(false);
        setCaucus('');
    }

    const stopSpeaker = () => {
        setElapsedTime(0);
    }

    // invoked every second
    const timerCycleTotal = () => {
        if(speakerStatus !== 'pause') {
            setElapsedTotalTime(elapsedTotalTime + 1);
        }
    }
    const timerCycleSpeaker = () => {
        if(speakerStatus !== 'pause') {
            setElapsedTime(elapsedTime + 1);
        }
    }
    
    let totalTimer = setTimeout(timerCycleTotal, 1000); 

    let speakerTimer = setInterval(function(){
        if(speakerStatus !== 'pause') {
            setElapsedTime(elapsedTime + 1);
        }
      
        if(speakerStatus !== 'stop'){ 
          clearInterval(speakerTimer)
        }
    }, 1000);

    return caucusExists ? (
        <div className='app-inner'>
            <div className='app-inner-inner'>
                <h1>Active Caucus</h1>
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
                            <div className='elapsed' style={{width: ((elapsedTotalTime) / parseInt(caucusInfo.time_total * 60) * 100) + '%'}}></div>
                        </div>
                    </div>
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
                                        <div className='elapsed' style={{width: ((elapsedTime) / parseInt(caucusInfo.time_speaker * 60) * 100) + '%'}}></div>
                                    </div>
                                    <div className='timer-text'>
                                        {Math.floor(elapsedTime / 60)} minutes {elapsedTime - Math.floor(elapsedTime / 60) * 60} seconds
                                    </div>
                                </div>
                                <div className='options'>
                                    <div className='media-button start' onClick={e=>setSpeakerStatus('start')}>
                                        Start
                                    </div>
                                    <div className='media-button pause' onClick={e=>setSpeakerStatus('pause')}>
                                        Pause
                                    </div>
                                    <div className='media-button pause' onClick={e=>{setElapsedTime(0); }}>
                                        Reset
                                    </div>
                                    <div className='media-button stop' onClick={e=>clearTimeout(speakerTimer)}>
                                        Stop
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                    <div className='caucus-action-tray'>
                        <div className='manage-speaker'>
                            <h3>Select Speaker</h3>
                            <div className='speaker-container'>
                                <div className='speaker-search'>
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