import React, { useEffect, useState } from 'react';
import MotionItem from '../components/MotionItem';
import { v4 as uuidv4 } from 'uuid';
import { useCommitteeContext } from '../contexts/CommitteeContext';

const RecordMotions = (props) => {
    const { getMotionsList, setMotionsList, setCaucus, getCaucus } = useCommitteeContext();

    const [displayNotification, setDisplayNotification] = useState(getCaucus() ? true : false);
    
    const [displayMotions, setDisplayMotions] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [motions, setMotions] = useState(getMotionsList() ? getMotionsList() : (
        {
            uuid: {
                type: 'Moderated Caucus',
                total: '',
                speaking: '',
                topic: ''
            }
        }
    ));

    const getTotal = (id) => {
        return motions[id].total;
    }

    const setTotal = (value, id) => {
        let newMotion = motions;
        newMotion[id].total = value;

        setMotionsList(newMotion);
    }

    const getSpeaking = (id) => {
        return motions[id].speaking;
    }
    
    const setSpeaking = (value, id) => {
        let newMotion = motions;
        newMotion[id].speaking = value;

        setMotionsList(newMotion);
    }

    const getType = (id) => {
        return motions[id].type;
    }

    const setType = (value, id) => {
        let newMotion = motions;
        newMotion[id].type = value;

        setMotionsList(newMotion);
    }

    const getTopic = (id) => {
        return motions[id].topic;
    }
    
    const setTopic = (value, id) => {
        let newMotion = motions;
        newMotion[id].topic = value;

        setMotionsList(newMotion);
    }

    const deleteMotion = (id) => {

        // delete (take care of actual job first)
        let newMotions = motions;
        delete newMotions[id];
        setMotionsList(newMotions);

        // delay for 0.2 sec for transition (have some fun)
        let thisElement = document.getElementsByClassName(id);
        thisElement[0].classList.add("hide");

        setTimeout(function() {
            // refresh delete (okay back to work)
            setTrigger(trigger ? false : true);
        }, (200));
    } 

    const getMotionsLength = () => {
        let i = 0;
        for(let item in motions) {
            i++;
        }
        return i;
    } 
    
    const addMotion = () => {

        if(getMotionsLength() < 6) {
            let uuid = uuidv4();

            setMotions({
                ...motions,
                [uuid]: {
                    type: 'Moderated Caucus',
                    total: '',
                    speaking: '',
                    topic: ''
                }
            });
            setTrigger(trigger ? false : true);
        }
    }

    const closeNotification = () => {
        let thisElement = document.getElementsByClassName('notification');
        thisElement[0].classList.add("hide");

        setTimeout(function() {
            setDisplayNotification(false);
        }, (200));
    }

    const handleToCaucus = (data, id) => {
        const { type, total, speaking, topic } = data;

        setCaucus({
            type: type,
            topic: topic,
            speakers_list: [],
            current_speaker: {},
            time_speaker: (!(type === 'Unmoderated Caucus') ? speaking : 'n/a'),
            time_total: (!(type === 'Round Table') ? total : 'n/a'),
            time_elapsed: '',
        });

        deleteMotion(id);

        props.toCaucus();
    }

    useEffect(() => {
        let displayArray = [];

        if(getMotionsLength() === 0) {
            displayArray.push(
                <div key={0} className='empty-motions'>
                    Wow, so empty!
                </div>
            );
        }

        for (let item in motions) {
            displayArray.push(
                <MotionItem
                    key={item}
                    id={item}
                    delete={deleteMotion}
                    total={getTotal}
                    setTotal={setTotal}
                    speaking={getSpeaking}
                    setSpeaking={setSpeaking}
                    type={getType}
                    setType={setType}
                    topic={getTopic}
                    setTopic={setTopic}
                    submit={handleToCaucus} />
            )
        }
        
        setDisplayMotions(displayArray);
    }, [trigger, motions]);

    return (
        <div className='app-inner'>
            <div className='app-inner-inner motions'>
                <div className='one-liner'>
                    <h1>Record Motion</h1>
                    <div className={`add-motion ${(getMotionsLength() < 6) ? '' : 'disabled'}`} onClick={addMotion}>Add Motion</div>
                </div>
                {(displayNotification) ? (
                    <div className='notification'>
                        <h3>Notice: Ongoing Caucus</h3>
                        <p>
                            There is already an active caucus in session (its time has not yet elapsed). Adding any motions to caucus will replace 
                            the current one.
                        </p>
                        <div className='action'>
                            <div className='noti-text-link' onClick={e=>closeNotification()}>Got it!</div>
                            <div className='noti-text-link'>Hide future notifications</div>
                        </div>
                    </div>
                ) : ''}
                <div className='motions-grid'>
                    {displayMotions}
                </div>
            </div>
        </div>
    );
}

export default RecordMotions;