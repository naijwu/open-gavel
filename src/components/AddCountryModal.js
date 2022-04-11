import React, { useEffect, useState } from 'react';

const AddCountryModal = (props) => {

    const [displayCountries, setDisplayCountries] = useState([]);

    const [countries, setCountries] = useState(props.countries);
    const [newSelectedCountries, setNewSelectedCountries] = useState([]);

    const close=()=> {
        // reset all temporary states

        // close down modal
        props.visibleFn(false);
    }

    const handleCountrySelect = (country_code) => {
        let countries = newSelectedCountries;

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
        setNewSelectedCountries(countries);
    }

    useEffect(() => {
        let displayArr = [];

        for (let i = 0; i < countries.length; i++) {
            displayArr.push(
                <div className={`country-item ${countries[i].country_code}A`} onClick={e=>handleCountrySelect(countries[i].country_code + 'A')}>
                    <div className='checked'></div>
                    <p>{countries[i].name}</p>
                    {/* <img src={`https://www.countryflags.io/${countries[i].country_code}/flat/32.png`} /> */}
                </div>
            );
        }
        setDisplayCountries(displayArr);
    }, [props.countries, countries]);

    const translateArray = (selectedCountries) => {
        let returnObjectArray = [];
        
        for (let i = 0; i < selectedCountries.length; i++) {
            returnObjectArray.push(countries.find(x => x.country_code === selectedCountries[i].substring(0, selectedCountries[i].length - 1)));
        }

        return returnObjectArray;
    }

    return (
        <div className='modal-container add-country'>
            <div className='modal'>
                <div className='modal-top'>
                    <div className='modal-top-text'>
                        Add UN Countries
                    </div>
                    <div className='modal-top-action'>
                        <a onClick={close} >Close</a>
                    </div>
                </div>
                <div className='modal-body'>
                    <h4>UN Countries Available</h4>
                    <div className='modal-country-list'>
                        {displayCountries}
                    </div>
                </div>
                <div className='modal-bottom'>
                    <button onClick={e=>props.submit(translateArray(newSelectedCountries))} className='add'>Add</button>
                    <button onClick={close} className='cancel'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddCountryModal;