import React, { useState } from 'react';

const MotionItem = (props) => {

    const [type, setType] = useState(props.type(props.id));
    const [total, setTotal] = useState(props.total(props.id));
    const [speaking, setSpeaking] = useState(props.speaking(props.id));
    const [topic, setTopic] = useState(props.speaking(props.id));

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

    const handleDelete = () => {
        props.delete(props.id);
    }

    return (
        <div className={`motion-item ${props.id}`}>
            <div className='motion-edit'>
                <div className='inputs'>
                    <div className='input-group'>
                        Type
                        <select value={type} onChange={e=>updateType(e)}>
                            <option value='Moderated Caucus'>Moderated</option>
                            <option value='Unmoderated Caucus'>Unmoderated</option>
                            <option value='Round Table'>Round Table</option>
                        </select>
                    </div>
                    <div className='time-input'>
                        <div className='input-group'>
                            Total Time
                            <input value={total} onChange={e=>updateTotal(e)} type='text' />
                        </div>
                        {(type === 'Moderated Caucus' || type === 'Round Table') ? (
                            <div className='input-group'>
                                Speaking Time
                                <input value={speaking} onChange={e=>updateSpeaking(e)} type='text' />
                            </div>
                        ) : ''}
                    </div>
                    <div className='input-group motion'>
                        Topic
                        <input value={topic} onChange={e=>updateTopic(e)} type='text' />
                    </div>
                </div>
                <div className='motion-action'>
                    To Caucus
                </div>
            </div>
            {((type === 'Unmoderated Caucus' || type === 'Round Table') && (total && speaking && topic)) ? (
                <div className='motion-preview'>
                    <p>
                        {total}:{speaking} {type} on {topic}
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
            )}
            <div className='subtle-delete' onClick={e=>handleDelete()}>Remove</div>
        </div>
    )
}

export default MotionItem;