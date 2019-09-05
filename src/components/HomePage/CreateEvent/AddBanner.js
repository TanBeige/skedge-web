import React from 'react';
import Slide from '@material-ui/core/Slide';
import Spinner from './Spinner'
import DisplayUploadedImage from './DisplayUploadedImage';
import { Mutation } from 'react-apollo';
import { MUTATION_EVENT_ADD } from '../../Todo/EventQueries'

import { Button } from '@material-ui/core'

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    width: '20%',
    minWidth: '10em',
    fontSize: 26,
    color: '#00A896',
    //fontWeight: '400'
}


const AddBanner = (props) => {
    let dir = props.goingBack ? 'right' : 'left';

    const [values, setValues] = React.useState({
        loading: false,
        imgSet: false,
        bannerImg: null
    });
    
    const bannerChoose = (banner) => {
      setValues({ ...values, bannerImg: banner });
    };

    const fileSelectedHandler = (event) => {
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

    const bannerSubmit = (event, addEvent) => {
        event.preventDefault();
        props.submitEvent(addEvent, values.bannerImg)
    }

    const content = () => {
        if (!values.imgSet) {
            return (
                <Slide direction={dir} in >
                    <div className='localOrPrivate'>
                        <input accept="image/*" 
                            id="banner-file-input" 
                            type="file" 
                            style={{display: 'none'}} 
                            onChange={fileSelectedHandler}
                            ref={fileInput => this.fileInput = fileInput}
                        />
                        <label htmlFor="banner-file-input" >
                            <Button className='InputBanner' size='large' variant='contained' color='secondary' component="span" style={buttonStyle}>
                                Upload Photo
                            </Button>
                        </label>
                        <div className='OrText'>
                            -Or-
                        </div>
                        <Button size='large' variant='contained' color='secondary' style={buttonStyle} onClick={bannerChoose}>
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
                    <Mutation mutation={MUTATION_EVENT_ADD} onCompleted={() => this.props.history.push('/')}>
                        {(addEvent, { error }) => {
                            if (error) {
                                alert("Something went wrong");
                            }
                            return (
                                <Button
                                    fullWidth
                                    type='submit'
                                    variant="contained"
                                    color="secondary"
                                    style={{height: '4em', width: '90%', marginTop: '2em'}}
                                    onClick={(event) => {bannerSubmit(event, addEvent)}}
                                    >
                                    Finish Creating Event!
                                </Button>
                            );
                            }}
                        </Mutation>
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