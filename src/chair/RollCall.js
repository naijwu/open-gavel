import React from 'react';
import Flag from 'react-flagpack';

const RollCall = (props) => {


    const displayCountries = () => {
        let displayArr = [];

        for (let i = 0; i < props.countries.length; i++) {
            displayArr.push(
                <div key={props.countries[i]._id} className={`country ${props.countries[i]._id} ${props.countries[i].presence}`}>
                    {(props.countries[i].country_code ?? props.countries[i]?.country_flag_url) && (
                        <div className="country-icon">
                            {props.countries[i].country_code ? (
                                <Flag code={props.countries[i].country_code} size="l" />
                            ) : (
                                <img className="country-flag-sm" alt={props.countries[i].name} src={props.countries[i]?.country_flag_url || props.countries[i]?.country_flag_base} />
                            )}
                        </div>
                    )}
                    <div className='country-name'>
                        {props.countries[i].name}
                    </div>
                    <div className='internetspace'></div>
                    <div className={`country-present ${props.countries[i].presence}`} onClick={e=>{(props.countries[i].presence === 'present') ? props.updateCountry(props.countries[i], 'absent') : props.updateCountry(props.countries[i], 'present')}}>
                        Present
                    </div>
                    <div className={`country-voting ${props.countries[i].presence}`} onClick={e=>{(props.countries[i].presence === 'voting') ? props.updateCountry(props.countries[i], 'absent') : props.updateCountry(props.countries[i], 'voting')}}>
                        Voting
                    </div>
                </div>
            )
        }

        return displayArr;
    }

    return (
        <div className='app-inner'>
            <div className='app-inner-inner rollcall'>
                <h1>Roll Call</h1>
                <div className='clc'>
                    {displayCountries()}
                </div>
            </div>
        </div>
    );
}

export default RollCall;