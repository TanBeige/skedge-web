import React from 'react';
import LoadImage from 'material-ui-image';
import { Link } from 'react-router-dom';

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});
require("./Related.css")
export default function RelatedItem({item, type}) {

    const spacesRemoved = item.name.replace(/\s/g, '-');
    const eventUrl = `/events/${item.id}-${encodeURI(spacesRemoved)}`;
    const dealUrl = `/deals/${item.id}-${encodeURI(spacesRemoved)}`;


    //Get Cloudinary Image
    let imageUrl;
    if(type==="event"){
        imageUrl = cloudinary.url(item.image.image_uuid, {secure: true, width: 400, height: 200, crop: "fill"})
    }
    else {
        imageUrl = cloudinary.url(item.cover_pic, {secure: true, width: 400, height: 200, crop: "fill"})
    }

    //Format Time
    var moment = require('moment');
    let formattedStartTime = ""
    if(item.start_time) {
      formattedStartTime = moment(item.start_time, "HH:mm:ss").format("h:mm A");
    }

    //Format Description
    let formattedDescription;
    if(type === 'event') {
        formattedDescription = `${item.location_name} | ${formattedStartTime} ${item.price != "$0.00" ? `| ${item.price}` : "| Free"}`
    }
    else {
        formattedDescription = `${item.location_name} | ${formattedStartTime} ${item.savings != 0 ? `| ${item.price}` : ""}`

    }
    
    return (
        <Link to={type === "event" ? eventUrl : dealUrl}>
            <div className='ListItem'>
                <div className='RelatedImage' >
                    <LoadImage 
                        color='white' 
                        src={imageUrl} 
                        aspectRatio={2/1}
                    />
                </div>
                <div className='ItemInfo'>
                    <p style={{fontSize: 16, marginBottom: '0.5em'}}>{item.name}</p>
                    <p style={{color: 'grey'}}>{formattedDescription}</p>
                    {/* <Link to={`/${item.user.name}`}>
                        <p>{item.user.name}</p>
                    </Link> */}
                </div>
            </div>
        </Link>
    )
}