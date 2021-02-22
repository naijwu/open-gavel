import React, { useEffect, useState } from 'react';

const EditCommitteeModal = (props) => {

    const close = (e) => {
        e.preventDefault();

        // clear all data -- shouldn't matter
        props.modalFn(false);
        props.errorFn('');
        props.nameFn('');
        props.usernameFn('');
        props.passwordFn('');
    }
    
    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Edit Committee
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={close} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <h4 className='modal-action-type'>Edit Committee/Staff Account</h4>
                    <div className='modal-body-action column'>
                        <div className='input-line'>
                            <h5>Committee Name:</h5>
                            <input type='text' value={props.name} onChange={e=>props.nameFn(e.target.value)} />
                        </div>
                        <div className='input-line'>
                            <h5>Username:</h5>
                            <div className='inline-input'>
                                <input type='text' value={props.username} onChange={e=>props.usernameFn(e.target.value)} />
                                <div className='inline-text'>@{props.conference.toLowerCase()}</div>
                            </div>
                        </div>
                        <div className='input-line'>
                            <h5>Passcode (Stored plain-text):</h5>
                            <input type='text' value={props.password} onChange={e=>props.passwordFn(e.target.value)} />
                        </div>
                        <div className='buttons-tray'>
                            <button onClick={e=>props.submit(props.id, props.name, props.username, props.password)} className='add'>Save</button>
                            <button onClick={close} className='cancel'>Cancel</button>
                        </div>
                    </div>
                    {props.error ? (
                        <div className='modal-error'>
                            {props.error}
                        </div>
                    ) : ''}
                </div>
            </div>
        </div>
    )
}

export default EditCommitteeModal;