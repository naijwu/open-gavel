import React, { useState } from 'react'; 
import { useAuthContext } from './authentication/AuthContext';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

const Preferences = () => {
    const { currentUser, updateCurrentUser, getTokenData } = useAuthContext();

    const userData = getTokenData();

    // Hooks for delegate statistics (filtering)
    const [primaryChecked, setPrimaryChecked] = useState(true);
    const [secondaryChecked, setSecondaryChecked] = useState(true);
    const [caucusChecked, setCaucusChecked] = useState(true);
    const [checked, setChecked] = useState('spc');

    const handleFilter = (type) => {
        setChecked((checked.indexOf(type) > -1) ? (checked.replace(type,'')) : (checked + type));
        switch (type) {
            case 'p':
                return setPrimaryChecked((checked.indexOf(type) > -1) ? false : true);
            case 's':
                return setSecondaryChecked((checked.indexOf(type) > -1) ? false : true);
            case 'c':
                return setCaucusChecked((checked.indexOf(type) > -1) ? false : true);
        }
    } 

    return (
        <div>
            <Navigation />
            <div className="main preferences">
                <div className='container'>
                    <h1>Committee Dashboard</h1>

                    <div className='settings'>
                        <h2>Committee Information</h2>
                        <div className='information-container'>
                            <div className='left-col'>
                                <div className='widget basic'>
                                    <div className='big'>
                                        <h3>{userData.conference}</h3>
                                        <h4>Conference</h4>
                                    </div>
                                </div>
                                <div className='widget countries'>
                                    <div className='big'>
                                        <h3>73</h3>
                                        <h4>Countries</h4>
                                    </div>
                                    <div className='small'>
                                        <p className='p'>
                                            23 Present
                                        </p>
                                        <p className='pv'>
                                            40 Voting
                                        </p>
                                        <p className='a'>
                                            10 Absent
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='statistics'>
                        <h2>Committee Statistics</h2>
                        <div className='information-container'>
                            <div className='left-col'>
                                <div className='widget stats'>
                                    <div className='big'>
                                        <h3>10</h3>
                                        <h4>Moderated Caucuses</h4>
                                    </div>
                                    <div className='small'>
                                        <p>
                                            120 minutes total
                                        </p>
                                    </div>
                                </div>
                                <div className='widget stats'>
                                    <div className='big'>
                                        <h3>5</h3>
                                        <h4>Unmoderated Caucuses</h4>
                                    </div>
                                    <div className='small'>
                                        <p>
                                            50 minutes total
                                        </p>
                                    </div>
                                </div>
                                <div className='widget stats'>
                                    <div className='big'>
                                        <h3>7</h3>
                                        <h4>Primary Speeches</h4>
                                    </div>
                                    <div className='small'>
                                        <p>
                                            14 minutes total
                                        </p>
                                    </div>
                                </div>
                                <div className='widget stats'>
                                    <div className='big'>
                                        <h3>20</h3>
                                        <h4>Secondary Speeches</h4>
                                    </div>
                                    <div className='small'>
                                        <p>
                                            32 minutes total
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='right-main'>
                                <div className='delegate-statistics'>
                                    <div className='del-stat-head'>
                                        <h4>Delegate Statistics</h4>
                                        <div className='del-stat-selector'>
                                            <div className={`selector primary ${primaryChecked}`} onClick={e=>handleFilter('p')}>
                                                <div className='checkmark'></div>
                                                <p>Primary Speeches</p>
                                            </div>
                                            <div className={`selector secondary ${secondaryChecked}`} onClick={e=>handleFilter('s')}>
                                                <div className='checkmark'></div>
                                                <p>Secondary Speeches</p>
                                            </div>
                                            <div className={`selector caucus ${caucusChecked}`} onClick={e=>handleFilter('c')}>
                                                <div className='checkmark'></div>
                                                <p>Caucuses + Other</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='del-stat-data'>
                                        yur
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Preferences;