import React from "react";

const Navigation = ({onRoutChange , isSignedIn}) => {
    
        if(isSignedIn){
            return(
                <nav style={{display:'flex',justifyContent:'flex-end',height:'80px'}}>
                    <p onClick={() => onRoutChange('signOut')} className='pa3 mr5 grow black link f3 pointer'>Sign Out</p>
                </nav>
            );
        }else{
            return(
                <nav style={{display:'flex',justifyContent:'flex-end',height:'80px'}}>
                    <p onClick={() => onRoutChange('signIn')} className='pa3 mr3 grow black link f3 pointer'>Sign in</p>
                    <p onClick={() => onRoutChange('register')} className='pa3 mr3 grow black link f3 pointer'>register</p>
                </nav> 
            );
        }
}

export default Navigation;
