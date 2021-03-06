import React, { useState } from 'react';

const MotionItem = (props) => {

    const [type, setType] = useState(props.type(props.id));
    const [total, setTotal] = useState(props.total(props.id));
    const [speaking, setSpeaking] = useState(props.speaking(props.id));
    const [topic, setTopic] = useState(props.topic(props.id));
    const [delegate, setDelegate] = useState(props.delegate(props.id));

    const updateTotal = (e) => {
        props.setTotal(e.target.value, props.id);
        setTotal(props.total(props.id));
    }

    const updateSpeaking = (e) => {
        props.setSpeaking(e.target.value, props.id);
        setSpeaking(props.speaking(props.id));
    }

    const updateType = (e) => {
        props.setType(e.target.value, props.id);
        setType(props.type(props.id));
    }

    const updateTopic = (e) => {
        props.setTopic(e.target.value, props.id);
        setTopic(props.topic(props.id));
    }
    
    const updateDelegate = (e) => {
        props.setDelegate(e.target.value, props.id);
        setDelegate(props.delegate(props.id));
    }

    const displayDelegates = () => {
        let displayArr = [];

        displayArr.push(
            <option value='empty'></option>
        );
        for(let i = 0; i < props.countries.length; i++) {
            displayArr.push(
                <option key={props.countries[i]._id} value={`${props.countries[i].name}`}>{props.countries[i].name}</option>
            );
        }

        return displayArr;
    }

    const handleDelete = () => {
        props.delete(props.id);
    }

    const handleSubmit = () => {
        // checking
        if(type === 'Moderated Caucus' && (total && speaking && topic)) {
            if(parseInt(total) >= parseInt(speaking)) {
                props.submit({type, total, speaking, topic}, props.id);
            } else {
                console.log('fug');
            }
        } else if (type==='Unmoderated Caucus' && (total && topic)) {
            props.submit({type, total, topic}, props.id);
        } else if (type==='Round Table' && (speaking && topic)) {
            props.submit({type, speaking, topic}, props.id);
        } else {
            console.log('form error');
        }
    }

    return (
        <div className={`motion-item ${props.id}`}>
            <div className='motion-edit'>
                <div className='inputs'>
                    <div className='input-group'>
                        Delegate
                        <select value={delegate} onChange={e=>updateDelegate(e)}>
                            {displayDelegates()}
                        </select>
                    </div>
                    <div className='input-group'>
                        Type
                        <select value={type} onChange={e=>updateType(e)}>
                            <option value='Moderated Caucus'>Moderated</option>
                            <option value='Unmoderated Caucus'>Unmoderated</option>
                            <option value='Round Table'>Round Table</option>
                        </select>
                    </div>
                    <div className='time-input'>
                        {(type === 'Moderated Caucus' || type === 'Unmoderated Caucus') ? (
                            <div className='input-group'>
                                Total (m)
                                <input value={total} onChange={e=>updateTotal(e)} type='text' />
                            </div>
                        ) : ''}
                        {(type === 'Moderated Caucus' || type === 'Round Table') ? (
                            <div className='input-group'>
                                Speaking (m)
                                <input value={speaking} onChange={e=>updateSpeaking(e)} type='text' />
                            </div>
                        ) : ''}
                    </div>
                    <div className='input-group motion'>
                        Topic
                        <input value={topic} onChange={e=>updateTopic(e)} type='text' />
                    </div>
                </div>
                <div className='motion-action' onClick={e=>handleSubmit()}>
                    Start
                </div>
            </div>
            {((type === 'Moderated Caucus') && (total && speaking && topic)) ? (
                <div className='motion-preview'>
                    <p>
                        {total}:{speaking} on {topic}
                    </p>
                </div>
            ) : ( (type === 'Round Table' && (speaking && topic)) ? (
                <div className='motion-preview'>
                    <p>
                        {speaking} min Roundtable on {topic}
                    </p>
                </div>
            ) : (
                (total && topic) && (
                    <div className='motion-preview'>
                        <p>
                            {total} min {type} on {topic}
                        </p>
                    </div>
                )
            )
            )}
            <div className='subtle-delete' onClick={e=>handleDelete()}>Remove</div>
        </div>
    )
}

export default MotionItem;