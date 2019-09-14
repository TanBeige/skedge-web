import React from 'react';
import Fade from '@material-ui/core/Fade';


const DisplayUploadedImage = ({bannerImg, onError}) => {
    console.log(bannerImg)

    return (
        <Fade>
            <div className='uploadedImage' style={{visibility:'visible', opacity: 1}}>
                <img 
                    src={URL.createObjectURL(bannerImg)} 
                    alt=''
                    onError={() => onError(bannerImg.public_id)}
                    style={{borderRadius: '0.5em', maxWidth: '90%', maxHeight: '80%'}}
                />
             </div>
        </Fade>
    )
}

export default DisplayUploadedImage;