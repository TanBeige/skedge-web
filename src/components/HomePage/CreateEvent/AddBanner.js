import React from 'react';
import Slide from '@material-ui/core/Slide';
import Spinner from './Spinner'
import DisplayUploadedImage from './DisplayUploadedImage';

import { MUTATION_EVENT_ADD } from "../../Todo/EventQueries";
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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

    // For Create Event Mutation
    
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

    const bannerSubmit = (e) => {
        const {bannerImg} = values;
        e.preventDefault();
        console.log("Props AddBanner: ", props)
        console.log("name: ", props.createState.name)

        props.submitEvent(bannerImg);
        /*
        props.client.mutate({
            mutation: gql`
            mutation insert_events($objects: [events_insert_input!]!) {
              insert_events(objects: $objects) {
                affected_rows
                returning {
                  id
                  name
                  description
                  created_at
                  updated_at
                }
              }
            }
          `,
            variables: {
                objects: [
                    {
                        creator_id: props.userId,
                        name: props.createState.name,
                        description: props.createState.description,
                        cohost_id: props.createState.cohost_id,
                        //event_type: props.createState.event_type,
                        event_date: this.state.event_date,
                        start_time: this.state.start_time,
                        end_time: this.state.end_time,
                        price: this.state.price,
                        allow_invites: this.state.allow_invites,
                        host_approval: this.state.host_approval,
                        category: this.state.category,

                        cover_pic: bannerImg,
                        street: this.state.street,
                        city: this.state.city,
                        state: this.state.state,
                    }
                ]
            }
        }).then(() =>{
            let path = `home`;
            props.history.push(path);
        })*/
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

export default graphql(MUTATION_EVENT_ADD)(AddBanner);