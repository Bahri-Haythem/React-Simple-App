import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl ,box}) => {
    return(
        <div className=' ma mt3 absolute' style={{left:'480px'}}>
            <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto'/>
            <div className='BoundingBox' 
            style={{top:box.topRow, right:box.rightCol, bottom:box.bottomRow, left:box.leftCol}}>
            </div>
        </div>
    );
}

export default FaceRecognition;