import React, { useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

const Speakers = (props) => {

    const { getSettings } = useCommitteeContext();

    const [ speaker, setSpeaker ] = useState(getSettings() ? getSettings().default_speaker_screen : '');

    return (
        <div className='app-inner'>
            <div className='app-inner-inner speakers'>
                <div className='one-liner'>
                    <h1>Speakers</h1>
                    <div className='speaker-lists'>
                        <div className={`speaker-type ${(speaker === 'Primary') ? 'active' : ''}`} onClick={e=>setSpeaker('Primary')}>Primary</div>
                        <div className={`speaker-type ${(speaker === 'Secondary') ? 'active' : ''}`} onClick={e=>setSpeaker('Secondary')}>Secondary</div>
                        <div className={`speaker-type ${(speaker === 'Single') ? 'active' : ''}`} onClick={e=>setSpeaker('Single')}>Single</div>
                    </div>
                </div>
                <div className='speakers-inner'>
                {(speaker === 'Primary') ? (
                    <div className='primary-list'>
                        <h2>Primary Speakers List</h2>
                    </div>
                ) : ''}
                {(speaker === 'Secondary') ? (
                    <div className='secondary-list'>
                        <h2>Secondary Speakers List</h2>
                    </div>
                ) : ''}
                {(speaker === 'Single') ? (
                    <div className='single-list'>
                        <h2>Single Speaker</h2>
                    </div>
                ) : ''}
                {(!speaker) ? (
                    'Select a speaker list'
                ) : ''}
                </div>
            </div>
        </div>
    );
}

export default Speakers;