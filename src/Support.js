import React from 'react';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

import HelpCircle from './assets/icons/help-circle.svg';

const Support = () => {
    return (
        <div className='support'>
            <Navigation />
            <div className='main support'>
                <div className='container'>
                    <h1>Find Support</h1>
                    <div className='faq'>
                        <h2>Frequently (?) asked Questions</h2>
                        <div className='wombo'>
                            <h3 className='q'><img src={HelpCircle} />How do i access the chairing program?</h3>
                            <p className='a'>The chairing program is only accessible through the committee/staff account. (secretariat accounts can only manage those accounts)</p>
                        </div>
                        <div className='wombo'>
                            <h3 className='q'><img src={HelpCircle} />Do you accept feature requests/how do I request a feature?</h3>
                            <p className='a'>Yes, contact me! If the scope of its application is large then it\'ll almost certainly be added to the program!</p>
                        </div>
                        <div className='wombo'>
                            <h3 className='q'><img src={HelpCircle} />Can I help develop OpenGavel?</h3>
                            <p className='a'>Sure! contact me!</p>
                        </div>
                        <div className='wombo'>
                            <h3 className='q'><img src={HelpCircle} />What tech stack is OpenGavel?</h3>
                            <p className='a'>React frontend, Node + Express backend, MongoDB w/ Atlas database + Mongoose for React.</p>
                        </div>
                    </div>
                    <div className='contact'>
                        <h2>Contact</h2>
                        <div className='duralock'>
                            <h4>Email jaewuchun@gmail.com</h4>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Support;