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
        bannerImg: null
    });

    // For Create Event Mutation
    
    const bannerChoose = (banner) => {
      setValues({ ...values, bannerImg: banner });
    };



    const bannerSubmit = (e) => {
        const {bannerImg} = values;
        e.preventDefault();
        console.log("Props AddBanner: ", props)
        console.log("Banner: ", bannerImg)

        props.submitEvent(bannerImg);
    }

    console.log(values.bannerImg)

    let content = "";
    if (values.bannerImg !== null) {
        content = (
            <div className="centerSubmit">
                <hr />
                <Button
                    fullWidth
                    type='button'
                    variant="contained"
                    color="primary"
                   // style={{height: '4em', width: '90%', marginTop: '2em'}}
                    onClick={(e)=>bannerSubmit(e)}
                    >
                    Finish Creating Event!
                </Button>
            </div>
        )
    }

    return (
        <div>
            <Slide direction={dir} in >
                <div className='addBanner'>
                    <div >
                        <ImageUpload setFile={bannerChoose} bannerImg={values.bannerImg}/>
                    </div>
                    <div >
                        <h1 className='OrText'>-Or-</h1>
                    </div>
                    <Button variant='contained' color='primary' style={buttonStyle} onClick={bannerChoose}>
                        Choose A Banner
                    </Button>
                    {content}
                </div>
            </Slide>
        </div>
    )
}

export default AddBanner;