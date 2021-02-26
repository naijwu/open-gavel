import React, { useEffect, useState } from 'react'; 
import { useAuthContext } from './authentication/AuthContext';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { countries } from './data/Countries';

// Country Object (For Reference);
// {
//     "name": "Zimbabwe",
//     "country_code": "ZW",
//     "country_flag_base": "...", // base64 of custom delegation flag (field doesnt exist for UN countries)
//     "stats_moderated": 0,
//     "stats_unmoderated": 0,
//     "stats_primary": 0,
//     "stats_secondary": 0
// }

const Preferences = () => {
    const { currentUser, updateCurrentUser, getTokenData } = useAuthContext();

    const userData = getTokenData();


    // This data should be received from the committee db entry
    const [committeeCountries, setCommitteeCountries] = useState(countries);
    const [displayCountries, setDisplayCountries] = useState([]); // Perhaps removing via database wouldn't require full reload (but useEffect would refresh the list)
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selected, setSelected] = useState('');

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

    const toggleCountrySelect = (country_code) => {
        let countries = selectedCountries;

        if(countries.indexOf(country_code) > -1) {
            // already selected -- remove (like toggle)
            countries.splice(countries.indexOf(country_code), 1);

            let selected = document.getElementsByClassName(country_code);
            selected[0].classList.remove('selected');
            
        } else {
            // not selected -- add
            countries.push(country_code);

            let selected = document.getElementsByClassName(country_code);
            selected[0].classList.add('selected');
        }
        setSelectedCountries(countries);
    }

    const handleCountrySelect = (country_code) => {

        // TODO: perhaps make Shift Click for toggling in-between country selections

        toggleCountrySelect(country_code);

        // not sure why, but selectedcountries.length alone cannot be used in ternary operator for conditional rendering
        if(selectedCountries.length > 0) {
            setSelected(selectedCountries.length); 
        } else {
            setSelected(false);
        }
    }

    const clearSelected = () => {
        for (let i = 0; i < selectedCountries.length; i++) {
            let selected = document.getElementsByClassName(selectedCountries[i]);
            selected[0].classList.remove('selected');
        }
        let countries = selectedCountries;
        setSelected(false);
        setSelectedCountries(countries.splice(0,countries.length));
    }

    useEffect(() => {
        let displayArr = [];

        if(committeeCountries.length === 0) {
            return (
                <div className='country-standin'>
                    Add countries by clicking the buttons below.
                </div>
            )
        }

        for (let i = 0; i < committeeCountries.length; i++) {
            displayArr.push(
                <div className={`country-item ${committeeCountries[i].country_code}`} onClick={e=>handleCountrySelect(committeeCountries[i].country_code)}>
                    <div className='checked'></div>
                    <p>{committeeCountries[i].name}</p>
                    <img src={`https://www.countryflags.io/${committeeCountries[i].country_code}/flat/32.png`} />
                </div>
            );
        }

        setDisplayCountries(displayArr);
    }, []);

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
                                        <h3>{userData.committee}</h3>
                                        <h4>{userData.conference}</h4>
                                    </div>
                                </div>
                                <div className='widget countries'>
                                    <div className='big'>
                                        <h3>{committeeCountries.length}</h3>
                                        <h4>Countries</h4>
                                    </div>
                                    <div className='small'>
                                        <p className='p'>
                                            - Present
                                        </p>
                                        <p className='pv'>
                                            - Voting
                                        </p>
                                        <p className='a'>
                                            - Absent
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='right-main'>
                                <div className='country-management'>
                                    <div className='country-manage-head'>
                                        <h4>Countries in Committee</h4>
                                    </div>
                                    <div className='country-list-container'>
                                        <div className={`country-list-wrap display${selected ? true : ''}`}>
                                            <div className='country-list-actions'>
                                                <button className='deselect-all' onClick={e=>clearSelected()}>Deselect All</button>
                                            </div>
                                            <div className='country-list'>
                                                {displayCountries}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='country-manage-actions'>
                                        <button className={`remove-country display${selected ? true : ''}`}>Remove Selected ({selectedCountries.length})</button>
                                        <button className='add-country un'>Add UN Countries</button>
                                        <button className='add-country custom'>Add Custom Country</button>
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