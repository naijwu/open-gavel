import React from 'react';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

const Support = () => {

    return (
        <div className='support'>
            <Navigation />
            <div className='main support'>
                <div className='container'>
                    <h1>Find Support</h1>
                    <div className='faq'>
                        <h2>Frequently asked Questions</h2>
                    </div>
                    <div className='contact'>
                        <h2>Contact</h2>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Support;