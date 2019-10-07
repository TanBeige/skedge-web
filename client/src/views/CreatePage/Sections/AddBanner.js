import React from 'react';
import Slide from '@material-ui/core/Slide';
import Spinner from './Spinner'
import DisplayUploadedImage from './DisplayUploadedImage';
import ImageUpload from 'components/CustomUpload/ImageUpload.js';


import Button from 'components/CustomButtons/Button.js'

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    minWidth: '10em',
    marginTop: 20,
    marginBottom: 20,
    //fontWeight: '400'
}


const AddBanner = (props) => {
    let dir = props.goingBack ? 'right' : 'left';

    const [values, setValues] = React.useState({
        loading: false,
        imgSet: false,
        bannerImg: null
    });

    // For Create Event Mutation
    
    const bannerChoose = (banner) => {
      setValues({ ...values, bannerImg: banner });
    };

    const fileSelectedHandler = (event) => {
        event.preventDefault();
        setValues({
            ...values,
            bannerImg: event.target.files[0],
            imgSet: true
        });
    }
    /*
    const fileUploadeHandler = () => {
        const fd = new FormData();
        fd.append('image', values.bannerImg, values.bannerImg.name)
    }*/

    const removeImage = () => {
        setValues({
            ...values,
            imgSet: false,
            bannerImg: null
        })
    }

    const bannerSubmit = (e) => {
        const {bannerImg} = values;
        e.preventDefault();
        console.log("Props AddBanner: ", props)

        props.submitEvent(bannerImg);
    }

    const content = () => {
        if (!values.imgSet) {
            return (
                <Slide direction={dir} in >
                    <div className='addBanner'>
                        <div >
                            <ImageUpload />
                        </div>
                        <div >
                            <h1 className='OrText'>-Or-</h1>
                        </div>
                        <Button variant='contained' color='primary' style={buttonStyle} onClick={bannerChoose}>
                            Choose A Banner
                        </Button>
                    </div>
                </Slide>
            )
        }
        else {
            return (
                <div>
                    <DisplayUploadedImage 
                        bannerImg={values.bannerImg}
                        removeImage={removeImage} 
                        onError={this.onError}
                    />
                    <div className="centerSubmit">
                        <Button
                            fullWidth
                            type='button'
                            variant="contained"
                            color="secondary"
                            style={{height: '4em', width: '90%', marginTop: '2em'}}
                            onClick={(e)=>bannerSubmit(e)}
                            >
                            Finish Creating Event!
                        </Button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            {content()}
        </div>
    )
}

export default AddBanner;