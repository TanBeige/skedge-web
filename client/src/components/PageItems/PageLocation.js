import React from 'react';

import PlaceIcon from '@material-ui/icons/Place';

// Google Maps API
import MapsApi from 'components/GoogleMaps/MapsApi.js';

require('./InfoItems.css');

export default function PageLocation({location_name, street, city, state, longitude, latitude, event_id, client, pageType}) {
    return (
        <div className='ItemPlace'>
            <div style={{width: '50%', display: 'flex'}}>
                <PlaceIcon style={{height: '100%', paddingBottom: '12px', marginRight: 5}}/>
                <h4 style={{ fontSize: '14px', margin: 0}}>
                {`${location_name}`} <br />
                {/* <HomeWorkIcon style={{verticalAlign: 'top'}}/> */}
                { street ? `${street} ` : ""} <br />
                {/* <MapIcon style={{verticalAlign: 'top'}}/> */}
                {`${city}, ${state}`}
                </h4>
            </div>
            <div style={{width: '50%'}}>
                <MapsApi 
                    street={street}
                    city={city}
                    state={state}
                    longitude={longitude}
                    latitude={latitude}
                    itemId={event_id}
                    page={pageType}
                    client={client}
                    pageLoaded={true}
                />
            </div>
        </div>
    )
}