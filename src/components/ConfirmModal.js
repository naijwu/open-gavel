import React, { useEffect, useState } from 'react';

const ConfirmModal = (props) => {



    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Confirm Delete
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={e=>{props.modalFn(false); props.errorFn('')}} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <h4 className='modal-action-type'>Are you sure you want to delete?</h4>
                    <div className='modal-body-action column'>
                        <div className='buttons-tray'>
                            <button onClick={e=>props.deleteFn(props.type, props.id)} className='delete'>Delete</button>
                            <button onClick={e=>{props.modalFn(''); props.errorFn('')}} className='cancel'>Cancel</button>
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

export default ConfirmModal;