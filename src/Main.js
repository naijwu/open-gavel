import React from 'react';

import Navigation from './components/Navigation';
import Footer from './components/Footer'

const Main = () => {

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='impact'>
                    <h1>Simple.</h1>
                    <h1>Powerful.</h1>
                    <h1>Open.</h1>
                </div>
                <div className='features'>
                    <h2>Features</h2>
                    <div className='grid'>
                        <div className='grid-item'>
                            <h4>Custom Delegations</h4>
                            <p>
                                Create your custom delegates for specialized committees.
                            </p>
                        </div>
                        <div className='grid-item'>
                            <h4>Custom Flags</h4>
                            <p>
                                Add customization to your countries with custom flags!
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
                            <h4>Free and Open &mdash; Forever!</h4>
                            <p>
                                OpenGavel will always be free to use for MUNs. All the code is also public on GitHub.
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
                                Register your conference to use OpenGavel by clicking here.
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