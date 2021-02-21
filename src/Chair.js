import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './OpenGavel.css';

import ArrowLeft from './assets/icons/arrow-left.svg';
import Edit from './assets/icons/edit.svg';
import Layers from './assets/icons/layers.svg';
import Users from './assets/icons/users.svg';
import User from './assets/icons/user.svg';
import Settings from './assets/icons/settings.svg';
import Sliders from './assets/icons/sliders.svg';

const Chair = () => {

    const [component, setComponent] = useState('default'); 
    const [slidOut, setSlidOut] = useState(true); 
    const [slidOutHover, setSlidOutHover] = useState(false); 

    return (
        <div className={`app-container slid${slidOut}`}>
            <div className={`side ${slidOut} hover${slidOutHover}`}>
                <div className='side-inner'>
                    <div className='tabs' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'rollcall') ? 'active' : ''}`} onClick={e => setComponent('rollcall')}>
                                <img src={Users} />
                                Roll Call
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'motions') ? 'active' : ''}`} onClick={e => setComponent('motions')}>
                                <img src={Edit} />
                                Motions
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'speakers') ? 'active' : ''}`} onClick={e => setComponent('speakers')}>
                              <img src={User} />
                                Speakers
                            </div>
                        </div>
                        <div className='tab'>
                            <div className={`tab-text ${(component === 'active-caucus') ? 'active' : ''}`} onClick={e => setComponent('active-caucus')}>
                                <img src={Layers} />
                                Active Caucus
                            </div>
                        </div>
                    </div>
                    <div className='whitespace'>

                    </div>
                    <div className='utility' onMouseOver={e=>setSlidOutHover(true)} onMouseLeave={e=>setSlidOutHover(false)} >
                        <div className='utility-text'>
                            <img src={Settings} />
                            Program Options
                        </div>
                        <Link className='utility-text' to='/committee/dashboard'>
                            <img src={Sliders} />
                            Dashboard
                        </Link>
                        <div className='utility-text' onClick={e=>setSlidOut((slidOut) ? false : true)}>
                            <img className='arrow' src={ArrowLeft} />
                            {(slidOut) ? (
                                <>
                                    Hide Panel
                                </>
                            ) : (
                                <>
                                    Hiding!
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Need to have OGContext here (for committee states) */}
            <div className='app-main'>
                {(component === 'default') ? (
                    <div className='centre-stamp'>
                        OpenGavel
                    </div>
                ): ''}
                {(component === 'rollcall') ? (
                    <div>
                        Roll Call
                    </div>
                ): ''}
                {(component === 'motions') ? (
                    <div>
                        Motions
                    </div>
                ): ''}
                {(component === 'speakers') ? (
                    <div>
                        Speakers
                    </div>
                ): ''}
                {(component === 'active-caucus') ? (
                    <div>
                        Active Caucus
                    </div>
                ): ''}
            </div>
        </div>
    )
}

export default Chair;