import React from 'react';

import Navigation from './components/Navigation';
import Footer from './components/Footer'

const Main = () => {

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='impact'>
                    Home
                </div>
            </div>
            <Footer />
        </>
    )

}

export default Main;