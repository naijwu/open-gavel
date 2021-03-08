import React, { useEffect, useState } from 'react';
import { useCommitteeContext } from '../contexts/CommitteeContext';

const Options = (props) => {

    const { getSettings, setSettings, setPushNext } = useCommitteeContext();

    const [ initialSettings, setInitialSettings ] = useState(getSettings() ? getSettings() : {});
    const [ madeChanges, setMadeChanges ] = useState(false);
    const [ refresh, setRefresh ] = useState(true);

    const [ options, setOptions ] = useState(getSettings() ? getSettings() : {});

    useEffect(() => {

        setInitialSettings(getSettings());
        setOptions(getSettings());
    }, [refresh]);

    useEffect(() => {
        let isDifferent = false;

        if(options.default_start_screen !== initialSettings.default_start_screen) {
            isDifferent = true;
        }
        if(options.default_drawer_position !== initialSettings.default_drawer_position) {
            isDifferent = true;
        }
        if(options.hide_all_notifications !== initialSettings.hide_all_notifications) {
            isDifferent = true;
        }
        if(options.auto_start_speaker_timer !== initialSettings.auto_start_speaker_timer) {
            isDifferent = true;
        }
        if(options.dark_mode !== initialSettings.dark_mode) {
            isDifferent = true;
        }

        if(isDifferent) {
            setMadeChanges(true);
        } else {
            setMadeChanges(false);
        }
    }, [options])

    function handleUpdate(setting, value) {
        let currentSettings = options;
        let newSettings = {};

        if (setting === 'default_start_screen') {
            newSettings = {
                ...currentSettings,
                default_start_screen: value
            }
        }
        if (setting === 'default_drawer_position') {
            newSettings = {
                ...currentSettings,
                default_drawer_position: value
            }
        }
        if (setting === 'hide_all_notifications') {
            newSettings = {
                ...currentSettings,
                hide_all_notifications: value.toString()
            }
        }
        if (setting === 'auto_start_speaker_timer') {
            newSettings = {
                ...currentSettings,
                auto_start_speaker_timer: value.toString()
            }
        }
        if (setting === 'dark_mode') {
            newSettings = {
                ...currentSettings,
                dark_mode: value.toString()
            }
        }

        setOptions(newSettings);
        setSettings(newSettings);
        setPushNext('true');
    }

    function saveSettings() {
        props.pushSettings(options);
        setPushNext('false');
        setRefresh(refresh ? false : true);
    }

    return (
        <div className='app-inner'>
            <div className='app-inner-inner preferences'>
                <h1>Program Options</h1>
                <div className='program-options'>
                    <div className='option-block'>
                        <h3>Default Start Screen</h3>
                        <select value={options.default_start_screen} onChange={e=>handleUpdate('default_start_screen', e.target.value)}>
                            <option value='Blank'>Blank</option>
                            <option value='Roll Call'>Roll Call</option>
                            <option value='Speakers'>Speakers</option>
                            <option value='Motions'>Motions</option>
                            <option value='Active Caucus'>Active Caucus</option>
                        </select>
                    </div>
                    <div className='option-block'>
                        <h3>Default Drawer Position</h3>
                        <div className='toggle-container'>
                            <div className={`custom-toggle ${(options.default_drawer_position === 'Opened') ? 'right' : 'left'}`} onClick={e=>{(options.default_drawer_position === 'Opened') ? handleUpdate('default_drawer_position', 'Closed') : handleUpdate('default_drawer_position', 'Opened')}}>
                                <div className={`toggle-slider`}>
                                    <div className={`toggle-dot`}>
                                    </div>
                                </div>
                            </div>
                            <div className='toggle-value'>
                                {options.default_drawer_position}
                            </div>
                        </div>
                    </div>
                    <div className='option-block'>
                        <h3>Hide All Notices</h3>
                        <div className='toggle-container'>
                            <div className={`custom-toggle ${(options.hide_all_notifications === 'true') ? 'right' : 'left'}`} onClick={e=>{(options.hide_all_notifications === 'true') ? handleUpdate('hide_all_notifications', 'false') : handleUpdate('hide_all_notifications', 'true')}}>
                                <div className={`toggle-slider`}>
                                    <div className={`toggle-dot`}>
                                    </div>
                                </div>
                            </div>
                            <div className='toggle-value'>
                                {(options.hide_all_notifications === 'true') ? 'Notices Hidden' : 'Notices Shown'}
                            </div>
                        </div>
                    </div>
                    <div className='option-block'>
                        <h3>Auto Start Speech Timer</h3>
                        <div className='toggle-container'>
                            <div className={`custom-toggle ${(options.auto_start_speaker_timer === 'true') ? 'right' : 'left'}`} onClick={e=>{(options.auto_start_speaker_timer === 'true') ? handleUpdate('auto_start_speaker_timer', 'false') : handleUpdate('auto_start_speaker_timer', 'true')}}>
                                <div className={`toggle-slider`}>
                                    <div className={`toggle-dot`}>
                                    </div>
                                </div>
                            </div>
                            <div className='toggle-value'>
                                {(options.auto_start_speaker_timer === 'true') ? 'Automatic Start' : "Manual Start"}
                            </div>
                        </div>
                    </div>
                    <div className='option-block'>
                        <h3>Dark Mode</h3>
                        <div className='toggle-container'>
                            <div className={`custom-toggle dark ${(options.dark_mode === 'true') ? 'right' : 'left'}`} onClick={e=>{(options.dark_mode === 'true') ? handleUpdate('dark_mode', 'false') : handleUpdate('dark_mode', 'true')}}>
                                <div className={`toggle-slider`}>
                                    <div className={`toggle-dot`}>
                                    </div>
                                </div>
                            </div>
                            <div className='toggle-value'>
                                {(options.dark_mode === 'true') ? 'Dark Mode' : "Light Mode"}
                            </div>
                        </div>
                    </div>
                    {(madeChanges) ? (
                    <div className='option-block'>
                        <div className='option-save' onClick={e=>saveSettings()}>
                            Save
                        </div>
                    </div>
                    ) : ''}
                </div>
            </div>
        </div>
    )
};

export default Options;