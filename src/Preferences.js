import React from 'react'; 
import Footer from './components/Footer';
import Navigation from './components/Navigation';

const Preferences = () => {

    return (
        <div>
            <Navigation />
            <div className="main preferences">
                <div className='container'>
                    <h1>Committee Dashboard</h1>
                    <div className='settings'>
                        <h2>Committee Settings</h2>
                    </div>

                    <div className='statistics'>
                        <h2>Delegate Statistics</h2>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Preferences;