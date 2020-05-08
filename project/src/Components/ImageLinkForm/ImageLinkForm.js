import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange , onButtonSubmit}) =>{
    return(
        <div>
            <p className='f3'>
                {'this is a face detector ,try now:'}
            </p>
            <div className='pa4 br3 shadow-3 w-70 ml7 form'>
                <input className='f4 pa2 w-20 center shadow-3' type='text' onChange={onInputChange}/>
                <button 
                className='w-10 grow f4 link ma3 white bg-light-purple pv2 dib ph3 shadow-3'
                onClick={onButtonSubmit}>Detect</button>
            </div>
            
        </div>
    );
}

export default ImageLinkForm;