import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import logo from './logo.png';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ scale:1.3, max : 45 }} style={{ height: 150, width: 150 }} >
            <div className="Tilt-inner"> 
            <img alt="this is a database" className='pt3' style={{width:'80%',height:'80%'}} src={logo}/>
            </div>
            </Tilt>
        </div>
    );
}

export default Logo;