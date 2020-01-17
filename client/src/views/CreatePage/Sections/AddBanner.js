import React, { useEffect } from 'react';
import Slide from '@material-ui/core/Slide';
import ImageUpload from 'components/CustomUpload/ImageUpload.js';
import gql from 'graphql-tag';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';


//import Button from 'components/CustomButtons/Button.js'
import Button from '@material-ui/core/Button';

// query bannerPics {
//     images(where: {image_uuid: {_ilike: "%default_images%"}}) {
//     id
//     image_uuid
//     }
// }


// Cloudinary setup
var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
    cloud_name: "skedge"
  });

const buttonStyle = {
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    minWidth: '10em',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
    fontSize: '12px',
    padding: '12px 30px'
    //fontWeight: '400'
}

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#02C39A"
      },
    },
  });


const AddBanner = (props) => {
    let dir = props.goingBack ? 'right' : 'left';

    const [values, setValues] = React.useState({
        loading: false,
        bannerImg: null,
        selectingBanner: false,
        selectBanners: []
    });

    // For Create Event Mutation
    
    const bannerSelect = (banner) => {
        setValues({
            ...values,
            selectingBanner: !values.selectingBanner
        })
    };

    const bannerChoose = (banner) => {
        setValues({ ...values, bannerImg: banner });
    };


    const bannerSubmit = (e) => {
        const {bannerImg} = values;
        e.preventDefault();

        props.submitEvent(bannerImg);
    }

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

    //Get banner pics before they show up
    const getBannerPics = () => {
        props.client.query({
            query: gql`
                query bannerPics {
                    images(where: {_and: [{id: {_gte: 184}}, {id: {_lte: 191}}]}
                    ){
                    id
                    image_uuid
                    }
                }
                `
        }).then((data) => {
            setValues({
                ...values,
                selectBanners: data.data.images
            })
        })
    }

    const selectBanners = () => {
        if (values.selectingBanner) {
            return (
                <div style={{textAlign: 'center'}}>
                    <h3 >Click image to select and submit event.</h3>
                    {
                        values.selectBanners.map(image => {
                            if(image) {
                                return  (
                                    <img
                                        key ={image.id}
                                        src={cloudinary.url(image.image_uuid, {secure: true, width: 600, height: 400, crop: "fill" ,fetch_format: "auto", quality: "auto"})} className='selectImage' 
                                        style={{width: '100%', margin: '10px 0px', maxWidth: 500, borderRadius: 3}} 
                                        onClick={()=>bannerChosen(image.id)}
                                    />
                                )
                            }
                        })
                    }
                </div>
            )
        }
        else {
            return
        }
    }

    //As soon as a user click on an image
    const bannerChosen = (imageId) => {
        props.submitEvent(imageId);
    }

    useEffect(() => {
        getBannerPics();
    }, [])

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Slide direction={dir} in >
                    <div className='addBanner'>
                        <div >
                            <ImageUpload setFile={bannerChoose} bannerImg={values.bannerImg}/>
                        </div>
                        <div >
                            <h1 className='OrText'>-Or-</h1>
                        </div>
                        <Button variant='contained' color='primary' style={buttonStyle} onClick={bannerSelect}>
                            Choose A Banner
                        </Button>
                        {selectBanners()}
                        {content}
                    </div>
                </Slide>
            </ThemeProvider>
        </div>
    )
}

export default AddBanner;

const presetBannerIDs = [
    "",
    "",
    ""
]