import React from 'react';

const MotionItem = (props) => {
    return (
        <div className='motion-item'>
        <div className='motion-edit'>
            <div className='inputs'>
                <div className='input-group'>
                    Type
                    <select value={props.type(props.index)} onClick={e=>props.setType(e.target.value, props.index)}>
                        <option value='Moderated'>Moderated</option>
                        <option value='unmoderated'>Unmoderated</option>
                        <option value='round-table'>Round Table</option>
                    </select>
                </div>
                <div className='input-group'>
                    Total Time
                    <input value={props.total(props.index)} onChange={e=>props.setTotal(e.target.value, props.index)} type='text' />
                </div>
                <div className='input-group'>
                    Speaking Time
                    <input value={props.speaking(props.index)} onChange={e=>props.setSpeaking(e.target.value, props.index)} type='text' />
                </div>
                <div className='input-group motion'>
                    Motion
                    <input value={props.topic(props.index)} onChange={e=>props.setTopic(e.target.value, props.index)} type='text' />
                </div>
            </div>
            <div className='motion-action'>
                To Caucus
            </div>
        </div>
        {(props.total(props.index) && props.speaking(props.index) && props.topic(props.index)) ? (
            <div className='motion-preview'>
                <p>
                    {props.total(props.index)}:{props.speaking(props.index)} {props.type(props.index)} Caucus on {props.topic(props.index)}
                </p>
            </div>
        ) : ''}
        <button onClick={e=>props.delete(props.index)}>Delete</button>
    </div>
    )
}

export default MotionItem;