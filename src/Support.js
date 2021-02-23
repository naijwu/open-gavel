import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

import HelpCircle from './assets/icons/help-circle.svg';

const Support = () => {

    const[faqHTML, setFaqHTML] = useState('');

    const faq = [
        {
            q: 'how do i access the chairing program?',
            a: 'the chairing program is only accessible through the committee/staff account. (secretariat accounts can only manage those accounts)',
        },
        {
            q: 'do you accept feature requests/how do I request a feature?',
            a: 'yes, contact me! If the scope of its application is large then it\'ll almost certainly be added to the program!'
        },
        {
            q: 'I found a bug. If I report it, do I get paid?',
            a: 'If I paid for bug reports, I\'d be broker than broke.'
        },
        {
            q: 'can I help develop opengavel?',
            a: 'sure! contact me!'
        },
        {
            q: 'what tech stack is opengavel?',
            a: 'React frontend, Node + Express backend, MongoDB w/ Atlas database.'
        },
    ];

    useEffect(() => {
        let returnArray = [];

        for (let i = 0; i < faq.length; i++) {
            returnArray.push(
                <div className='wombo'>
                    <h3 className='q'><img src={HelpCircle} />{faq[i].q}</h3>
                    <p className='a'>{faq[i].a}</p>
                </div>
            )
        }

        setFaqHTML(returnArray);
    }, []);

    return (
        <div className='support'>
            <Navigation />
            <div className='main support'>
                <div className='container'>
                    <h1>Find Support</h1>
                    <div className='faq'>
                        <h2>Frequently (?) asked Questions</h2>
                        {faqHTML ? faqHTML : ''}
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