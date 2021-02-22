import React, { useEffect, useState } from 'react';

const CommitteeModal = (props) => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const updateUsername = (value) => {
        setUsername(value.replace(/\s|\.|\'|\"|\,|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\-|\=|\/|\\|\?|\>|\</g, ''));
    }
    
    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Create Account
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={e=>{props.modalFn(false); props.errorFn('')}} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <h4 className='modal-action-type'>Create Committee/Staff Account</h4>
                    <div className='modal-body-action column'>
                        <div className='input-line'>
                            <h5>Committee Name:</h5>
                            <input type='text' value={name} onChange={e=>setName(e.target.value)} />
                        </div>
                        <div className='input-line'>
                            <h5>Username:</h5>
                            <div className='inline-input'>
                                <input type='text' value={username} onChange={e=>updateUsername(e.target.value)} />
                                <div className='inline-text'>@{props.conference.toLowerCase()}</div>
                            </div>
                        </div>
                        <div className='input-line'>
                            <h5>Passcode (Stored plain-text):</h5>
                            <input type='text' value={password} onChange={e=>setPassword(e.target.value)} />
                        </div>
                        <div className='buttons-tray'>
                            <button onClick={e=>props.createCommittee(name, username, password)} className='add'>Create</button>
                            <button onClick={e=>{props.modalFn(false); props.errorFn('')}} className='cancel'>Cancel</button>
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

export default CommitteeModal;