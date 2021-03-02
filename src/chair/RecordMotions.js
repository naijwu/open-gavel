import React, { useEffect, useState } from 'react';
import MotionItem from '../components/MotionItem';

const RecordMotions = (props) => {

    const [displayMotions, setDisplayMotions] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [motions, setMotions] = useState([
        {
            type: '',
            total: '',
            speaking: '',
            topic: ''
        }
    ]);

    const getTotal = (index) => {
        return motions[index].total;
    }

    const setTotal = (value, index) => {
        setMotions(motions[index].total = value);
    }

    const getSpeaking = (index) => {
        return motions[index].speaking;
    }
    
    const setSpeaking = (value, index) => {
        setMotions(motions[index].speaking = value);
    }

    const getType = (index) => {
        return motions[index].type;
    }

    const setType = (value, index) => {
        setMotions(motions[index].type = value);
    }

    const getTopic = (index) => {
        return motions[index].topic;
    }
    
    const setTopic = (value, index) => {
        setMotions(motions[index].topic = value);
    }

    const deleteMotion = (index) => {
        setMotions(motions.splice(index, 1));
        setTrigger(trigger ? false : true);
    } 

    useEffect(() => {
        let displayArray = [];

        for (let i = 0; i < motions.length; i++) {
            displayArray.push(
                <MotionItem
                    index={i}
                    delete={deleteMotion}
                    total={getTotal}
                    setTotal={setTotal}
                    speaking={getSpeaking}
                    setSpeaking={setSpeaking}
                    type={getType}
                    setType={setType}
                    topic={getTopic}
                    setTopic={setTopic} />
            )
        }
        
        setDisplayMotions(displayArray);
    }, [trigger]);
    
    const addMotion = () => {
        if(motions.length < 6) {
            let lemotions = motions;
            lemotions.push(
                {
                    type: '',
                    total: '',
                    speaking: '',
                    topic: ''
                });
            setMotions(lemotions);
            setTrigger(trigger ? false : true);
        }
    }

    return (
        <div className='app-inner'>
            <div className='app-inner-inner rollcall'>
                <h1>Record Motion</h1>
                <div className='motions-grid'>
                    {displayMotions}
                </div>
                {(motions.length < 6) ? (
                    <button onClick={addMotion}>Add Motion</button>
                ) : ''}
            </div>
        </div>
    );
}

export default RecordMotions;