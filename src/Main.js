import React from 'react';

import Navigation from './components/Navigation';

const Main = () => {

    return (
        <>
            <Navigation />
            <div className='main'>
                <div className='impact'>
                    Home
                </div>
            </div>
            <div className='footer'>
                OpenGavel project &middot; free chairing program for MUN<br />
                want to improve? &middot; <a href='mailto:jaewuchun@gmail.com'>shoot me an email</a><br />
                github &middot; <a href='http://github.com/naijwu/open-gavel'>open-gavel</a>
            </div>
        </>
    )

}

export default Main;