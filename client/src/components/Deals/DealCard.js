import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import _ from 'lodash';
// @material-ui/icons
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
// import StarIcon from '@material-ui/icons/Star';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from 'components/Card/CardFooter';
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Info from "components/Typography/Info.js";
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
// import Badge from 'components/Badge/Badge.js';

//Notification Popups
import { store } from 'react-notifications-component';

//Style
import sectionPillsStyle from "assets/jss/material-kit-pro-react/views/blogPostsSections/sectionPillsStyle.js";

//Images
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import LoadImage from 'material-ui-image'
import RedeemButton from 'components/RedeemButton.js';

//import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';

var moment = require("moment")

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

const useStyles = makeStyles(sectionPillsStyle);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02C39A"
    },
    secondary: {
      main: "#FFFFFF"
    },
    warning: {
      main: "#ffff00"
    }
  },
});


export default function DealCard({ itemInfo, userId, client, currentDate, email }) {

  // Styling
  const classes = useStyles();
  const usernameStyle= {
    float: 'right',
    borderRadius: 8,  
    backgroundColor: "rgba(255,255,255,1.0)", 
    color: "#02C39A",
    padding: '0px 5px', 
    fontSize: 12,
    // WebkitTextStroke: 0.5, 
    // WebkitTextStrokeColor: "black",
    border: '1px solid #02C39A',
    marginLeft: 3,
    //marginTop: "10px",
  }

  const dateStyle = {
    //color: "#02C39A",
    textAlign: 'center',
    position: "absolute",
    //display: 'inline',
    top: "3px",
    left: "0px",
    borderRadius: 3,  
    backgroundColor: "#02C39A", 
    color: "white",
    padding: '0px 8px 0px 8px', 
    border: '1px solid #02C39A',
    marginLeft: 3,
    lineHeight: 0,
  }
  
  // Setting Event Info
  const [values, setValues] = useState({

    // likeAmount: itemInfo.deal_likes_aggregate.aggregate.count,
    // usersLiked: itemInfo.deal_likes,
    // ifLiked: itemInfo.deal_likes.some(user => user.user_id === userId) ? "secondary" : "inherit",

    // ifSaved: itemInfo.user_saved_deals.some(user  => user.user_id === userId) ? true : false,

    name: itemInfo.name ? itemInfo.name : "",
    point_1: itemInfo.point_1 ? itemInfo.point_1 : "",
    point_2: itemInfo.point_2 ? itemInfo.point_2 : "",
    description: itemInfo.description ? itemInfo.description : "",
    // category: itemInfo.category ? itemInfo.category : "No Category",
    image_id: itemInfo.cover_pic ? itemInfo.cover_pic : "cover_images/uzhvjyuletkpvrz5itxv",
    image_url: cloudinary.url(itemInfo.cover_pic, {secure: true, width: 800, height: 400, crop: "fill" ,fetch_format: "auto", quality: "auto"}),
    
    savings: itemInfo.savings,

    start_date:  itemInfo.start_date ? moment(itemInfo.start_date, "YYYY-MM-DD") : "No Date",
    end_date: itemInfo.end_date ? moment(itemInfo.end_date, "YYYY-MM-DD") : "No Date",
    start_time: moment(itemInfo.start_time, "HH:mm:ss"),
    end_time: itemInfo.end_time ? moment(itemInfo.end_time, "HH:mm:ss") : null,

    isRecurring: itemInfo.is_recurring ? itemInfo.is_recurring : false,
    weekday: itemInfo.weekday ? itemInfo.weekday : "",
    
    username: itemInfo.user ? itemInfo.user.name : "",


    //Get Profile Picture UUID and call image with cloudinary
    userProfilePic: itemInfo.user ? cloudinary.url(itemInfo.user.picture, {secure: true, width: 32, height: 32, crop: "fill"}) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    userId: itemInfo.user ? itemInfo.user.id : 0,
    user_auth0: itemInfo.user ? itemInfo.user.auth0_id : null
  })

  let coverImgStyle= {
    position: 'relative', 
    margin: '0.5em 0.5em 0em 0.5em', 
    borderRadius: 3, 
    overflow: 'hidden',
    border: '1px solid lightgray'
  }


  //Functions 
  const handleLike = () => {
    // if(values.ifLiked !== "inherit") {
    //   client.mutate({
    //     mutation: MUTATION_UNLIKE_EVENT,
    //     refetchQueries: [{
    //       query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT,
    //       variables: {
    //         userId: userId
    //       }
    //     }],
    //     variables: {
    //       eventId: event.id,
    //       userId: userId
    //     }
    //   }).then((data) => {
    //     console.log('UnLike!: ', data)
    //     setValues({
    //       ...values,
    //       ifLiked: "inherit",
    //       likeAmount: (values.likeAmount - 1)
    //     })
    //   })
    // }
    // else {
    //   client.mutate({
    //     mutation: MUTATION_LIKE_EVENT,
    //     refetchQueries: [{
    //       query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT,
    //       variables: {
    //         userId: userId
    //       }
    //     }],
    //     variables: {
    //       eventId: event.id,
    //       userId: userId,
    //       objects: {
    //         user_id: values.user_auth0,
    //         activity_type: 0,
    //         source_id: event.id,
    //         other_user_id: userId
    //       }
    //     }
    //   }).then((data) => {
    //     console.log('Like!: ', data)
    //     setValues({
    //       ...values,
    //       ifLiked: "secondary",
    //       likeAmount: (values.likeAmount + 1)
    //     });
    //   })
    // }
  }

  const handleSave = () => {
    // if(values.ifSaved === true) {
    //   client.mutate({
    //     mutation: MUTATION_EVENT_UNDO_SAVE,
    //     refetchQueries: [{
    //       query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT,
    //       variables: {
    //         userId: userId
    //       }
    //     }],
    //     variables: {
    //       eventId: event.id,
    //       userId: userId
    //     }
    //   }).then((data) => {
    //     console.log('Unsave!: ', data)
    //     setValues({
    //       ...values,
    //       ifSaved: false,
    //     })
    //   })
    // }
    // else {
    //   client.mutate({
    //     mutation: MUTATION_EVENT_SAVE,
    //     refetchQueries: [{
    //       query: listType === "following" ? FETCH_FOLLOWING_FEED : QUERY_FILTERED_EVENT,
    //       variables: {
    //         userId: userId
    //       }
    //     }],
    //     variables: {
    //       eventId: event.id,
    //       userId: userId
    //     }
    //   }).then((data) => {
    //     console.log('Save!: ', data)
    //     setValues({
    //       ...values,
    //       ifSaved: true,
    //     })
    //   })
    // }
  }

  // Date displayed on the top-left corner of the date
  let displayCornerDate = ""
  if(currentDate) {
    const displayMonth = moment(currentDate).format("MMM")
    const displayDay = moment(currentDate).format("D")

    displayCornerDate = (
      <div style={dateStyle}>
        <h5 style={{margin: 0, padding: 0, fontSize: 12, fontWeight: "600"}}>{displayMonth}</h5>
        <h5 style={{margin: '-5px 0px -2px 0px', fontSize: 12, fontWeight: "600"}}>{displayDay}</h5>
      </div>
    )
  }


  const spacesRemoved = itemInfo.name.replace(/\s/g, '-');
  const dealUrl = `/deals/${itemInfo.id}-${encodeURIComponent(spacesRemoved)}`;
  

  return (
    <div>
        {/* <div style={{position: 'absolute', right: 0, top: 0}}>
          <IconButton aria-label="save" onClick={()=>{console.log("Ass")}}>
            <StarIcon color={'secondary'} fontSize='large'/>
          </IconButton> 
        </div> */}
        <Link to={dealUrl}>
          <div>
            <img src={values.image_url} style={{height: 150, width: '100%', objectFit: 'cover'}}/>
            <div style={{display: 'inline-flex'}}>
              <div style={{margin: '6px 0.5em 0px 0.5em', fontWeight: 400}}>
                <p style={{fontSize: 18, color: 'black'}}>{itemInfo.name}</p>
                <p style={{fontSize: 14, color: 'grey'}}>{itemInfo.location_name} | {moment(itemInfo.start_time, "HH:mm:ss").format("h:mm A")} {itemInfo.end_time && `- ${moment(itemInfo.end_time, "HH:mm:ss").format("h:mm A")}`}</p>
              </div>
            </div>
          </div>
        </Link>
          


      <div  style={{textAlign: 'right', width: '100%'}}>
        <div style={{marginBottom: 6}}>
          <RedeemButton 
            client={client}
            phone_number={itemInfo.phone_number} 
            web_url={itemInfo.web_url} 
            city={itemInfo.city} 
            state={itemInfo.state} 
            street={itemInfo.street}

            deal_name={itemInfo.name}
            description={itemInfo.description}
            location_name={itemInfo.location_name}
            picId={itemInfo.cover_pic}

            email={email}

          />
        </div>
      </div>
    </div>
  )

  return(
        <ThemeProvider theme={theme}>
          {/* <Grow in={true}> */}
            <Card style={{border: "2px solid darkgrey", marginTop: 5}} raised>  
              {/* <CardHeader image style={{marginBottom: -30}}> */}
  
              <div style={coverImgStyle}>
                <Link to={dealUrl}>
                  <LoadImage className={classes.imgCardTop} color='white' src={values.image_url} aspectRatio={2/1}/>
                </Link>
  
                  <div className={classes.imgCardOverlay} style={{width: '100%'}}>
                    {displayCornerDate}

  
                    <Link to={`/${values.username}`}>
                      <div
                        // className={classes.cardTitle}
                        style={{
                          color: "#02C39A",
                          position: "absolute",
                          bottom: "0px",
                          left: "6px",
                        }}
                      >
                        <Avatar style={{float:'left', border: '1px solid #02C39A', height: 32, width: 32}} width={32} alt={values.username} src={values.userProfilePic}/>
                        <h5 style={usernameStyle}>
                          @{values.username}
                        </h5>
                      </div>
                    </Link>
                  </div>
              </div>
              {/* </CardHeader> */}
  
                <CardBody style={{padding: '0px 15px'}}>
                
                  {/* {followFeedInfo} */}
  
                  <Link to={dealUrl}>
                    <h3 style={{margin: '5px 0px 0px 0px', textAlign: "center", fontSize: '1.5em'}}>{values.name}</h3>
                  </Link>
                  {/* <EventMomentsWrapper 
                    eventId={itemInfo.id}
                    cover={values.image_url}
                    client={client}
                    type={type}
                    //ifGoing={values.ifGoing}
                  /> */}
                  <hr style={{margin: 2}}/>
  
                  <div style={{fontSize: 14}}>
                    <div style={{width: '100%', textAlign: 'left'}}>
                      <AccessAlarmIcon fontSize='small' style={{verticalAlign: 'top'}}/>
                      {` ${values.start_time.format("h:mma")}`}
                      {values.end_time ? ` - ${values.end_time.format("h:mma")}` : ""}
                    </div>
                    
                    <div style={{textAlign: 'left'}}>
                      <p style={{display: 'inline', width: '100%'}}>
                        <PlaceIcon color="secondary" fontSize='small' style={{verticalAlign: 'top'}} />
                        {` ${itemInfo.location_name}`}
                      </p>
                    </div>
                  </div>
                    <div style={{display: 'flex', color: 'gold'}}> 
                      {/* <FlareIcon size='small' style={{fontSize: 12, margin: 'auto 4px'}}/> */}
                      <p style={{color: 'black'}}>{itemInfo.point_1}</p>
                    </div>
                </CardBody>
  
                <CardFooter style={{padding: '0rem 1rem'}}>
                  <Info style={{textAlign: 'left'}}>
                    <h6 color='primary' className={classes.cardCategory}>Deal</h6>
                  </Info>
                  {/* <div style={{position: 'absolute',right: 15}}>
                    <IconButton onClick={handleLike} aria-label="Like" style={{padding: 6}}>
                      <LoyaltyIcon /> 
                    </IconButton>
                    <IconButton onClick={handleLike} aria-label="Like" style={{padding: 6}}>
                      <FavoriteIcon color={values.ifLiked}/>
                      <div style={{fontSize: 14}}>
                        {values.likeAmount}
                      </div> 
                    </IconButton>
                  </div> */}
                </CardFooter>
            </Card>
          {/* </Grow> */}
        </ThemeProvider>
      )
}