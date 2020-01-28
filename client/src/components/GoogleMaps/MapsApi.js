import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

import PlaceIcon from '@material-ui/icons/Place';
import { prototype } from 'react-infinite-scroll-component';
import {
  QUERY_DEAL_INFO,
  FETCH_EVENT_INFO,
  ADD_GEOCODE_EVENT,
  ADD_GEOCODE_DEAL,
} from 'EventQueries/EventQueries.js'

// Import custom styles to customize the style of Google Map
const styles = require('./GoogleMapStyles.json')
require('dotenv');
 
const AnyReactComponent = () => <PlaceIcon />;
let _isMounted = true;

//Styling maps
function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    // zoomControlOptions: {
    //   position: maps.ControlPosition.RIGHT_CENTER,
    //   style: maps.ZoomControlStyle.SMALL
    // },
    // mapTypeControlOptions: {
    //   position: maps.ControlPosition.TOP_RIGHT
    // },
    // mapTypeControl: true,
    styles: styles
  };
}
 
class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      center: {
        lat: props.latitude,
        lng: props.longitude
      },
      zoom: 17,
      loading: true,
      error: false
    }
  }

  geocodeToDatabase(lat, long, itemId, mutation) {
    this.props.client.mutate({
      mutation: mutation,
      variables: {
        itemId: itemId,
        latitude: lat,
        longitude: long
      }
    })
  }

  getGeocode() {
    this.setState({loading: true})

    if(this.props.latitude && this.props.longitude) {
      if(_isMounted) {
        this.setState({
          center: {
            lat: this.props.latitude,
            lng: this.props.longitude
          },
          loading: false
        })
      }
      console.log("has lat long", this.props)
      return
    }
    // if(!this.props.latitude || !this.props.longitude) {
      Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API);
      Geocode.enableDebug();

      console.log("doesnt have lat long", this.props)



      const fullAddy = `${this.props.street} ${this.props.city}, ${this.props.state}`

      Geocode.fromAddress(fullAddy).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          this.geocodeToDatabase(lat, lng, this.props.itemId, this.props.page === 'events' ? ADD_GEOCODE_EVENT : ADD_GEOCODE_DEAL );

          if(_isMounted) {
            this.setState({
              center: {
                lat: lat,
                lng: lng
              },
              loading: false
            })
          }
        },
        error => {
          console.error(error);
        }
      );
    // }
  }
  
  componentDidMount() {
    _isMounted = true;
    // if(this.props.pageLoaded)
    if(this.props.state !== "") {
      this.getGeocode();
    }
  }

  componentWillUnmount(){
    _isMounted = false;
  }

  render() {
    if(this.state.loading) {
      return ""
    }
    else if(this.state.error) {
      return ""
    }
    else {
      return (
        // Important! Always set the container height explicitly
        <div style={{ height: '50vh', width: '100%', borderRadius: 20, overflow: 'hidden' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API}}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
            options={createMapOptions} 
            yesIWantToUseGoogleMapApiInternals
          >
            <AnyReactComponent
              lat={this.state.center.lat}
              lng={this.state.center.lng}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      );
    }
  }
}
 
export default SimpleMap;