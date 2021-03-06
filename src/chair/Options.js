import React from 'react';

const Options = (props) => {
    
    //     default_start_screen, (dropdown, blank/rollcall/speakers/motions/active-caucus)
    //     hide_all_notifications,
    //     default_drawer_position,
    //     auto_start_speaker_timer,
    //     dark_mode,


    return (
        <div className='app-inner'>
            <div className='app-inner-inner rollcall'>
                <h1>Program Options</h1>
                <div className='program-options'>
                    default_start_screen, default_drawer_position, hide_all_notifications, auto_start_speaker_timer, dark_mode
                </div>
            </div>
        </div>
    )
};

export default Options;