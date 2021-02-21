import React from 'react'; 
import Navigation from './components/Navigation';

const Preferences = () => {

    return (
        <div>
            <Navigation />
            Page for staff to configure committee
                    <div className='utility-text'>
                        Delegate Statistics
                    </div>
                    <div className='utility-text'>
                        Committee Settings
                    </div>
        </div>
    )
}

export default Preferences;