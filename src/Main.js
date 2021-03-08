import React from 'react';
import { BrowserRouter as Switch, Router, Link } from 'react-router-dom';

import Navigation from './components/Navigation';
import Footer from './components/Footer'

const Main = () => {

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='impact'>
                    <h1>Simple. Powerful. Open.</h1>
                    <h2>Chairing Program for Model UN Conferences</h2>
                </div>
                <div className='features'>
                    <h2>Features</h2>
                    <div className='grid'>
                        <div className='grid-item'>
                            <h4>Custom Delegations</h4>
                            <p>
                                Create your custom delegates (with your own flags!) for specialized committees.
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Presentation Mode</h4>
                            <p>
                                Gone are the days of sacrificing a laptop to chair. Use presentation mode for a cleaner interface and greater accessibility.
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Easy Organization</h4>
                            <p>
                                Conference secretariats can easily manage OpenGavel accounts for committees.
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Intuitive Interface</h4>
                            <p>
                                Familiarize yourself immediately just by clicking around the application!
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Active Developer</h4>
                            <p>
                                Requested features will always be considered to be added to OpenGavel!
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Open and (mostly) free!</h4>
                            <p>
                                The first 10 committee accounts will always be free. All the code is also public on GitHub.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='next'>
                    <h2>Get Started</h2>
                    <div className='cta'>
                        <div className='card'>
                            <h4>I'm a Secretariat</h4>
                            <p>
                                Register your conference to use OpenGavel by clicking <Link className='text-link inline' to={'/register'}>here</Link>.
                            </p>
                        </div>
                        <div className='card'>
                            <h4>I'm a Staff</h4>
                            <p>
                                Ask your secretariat to create an OpenGavel account&mdash;It's free!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )

}

export default Main;