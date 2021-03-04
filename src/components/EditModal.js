import React, { useEffect, useState } from 'react';

const EditModal = (props) => {

    useEffect(() => {
        props.newValueFn(props.currentUser[props.fieldName]);
    }, [])
    
    const prettifySwitchboard = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        conference: 'Conference Name (Abbreviated)',
        conferenceFullName: 'Conference Name (Full)',
    }

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Edit profile
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={e=>{props.closeModalFN(''); props.errorFn('')}} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <h4 className='modal-action-type'>Edit {prettifySwitchboard[props.fieldName]}</h4>
                    <div className='modal-body-action'>
                        <input type='text' value={props.newValue} onChange={e=>props.newValueFn(e.target.value)} />
                        <button onClick={e=>props.afterStateFN(props.fieldName, props.newValue)} className='edit'>Save</button>
                        <button onClick={e=>{props.closeModalFN(''); props.errorFn('')}} className='cancel'>Cancel</button>
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

export default EditModal;