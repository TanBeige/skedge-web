import React from 'react';
import LoadImage from 'material-ui-image';
import { Link } from 'react-router-dom';

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});
require("./Related.css")
export default function RelatedItem({item, type}) {
    //Get Cloudinary Image
    const imageUrl = cloudinary.url(item.image.image_uuid, {secure: true, width: 400, height: 200, crop: "fill"})
    
    //Format Time
    var moment = require('moment');
    let formattedStartTime = ""
    if(item.start_time) {
      formattedStartTime = moment(item.start_time, "HH:mm:ss").format("h:mm A");
    }
    return (
        <Link to={type === "event" ? `/events/${item.id}` : `/deals/${item.id}`}>
            <div className='ListItem'>
                <div className='RelatedImage' >
                    <LoadImage 
                        color='white' 
                        src={imageUrl} 
                        aspectRatio={2/1}
                    />
                </div>
                <div className='ItemInfo'>
                    <p style={{fontSize: 16}}>{item.name}</p>
                    <p>{item.location_name} | {formattedStartTime}</p>
                    {/* <Link to={`/${item.user.name}`}>
                        <p>{item.user.name}</p>
                    </Link> */}
                </div>
            </div>
        </Link>
    )
}