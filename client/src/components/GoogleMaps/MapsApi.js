import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

import PlaceIcon from '@material-ui/icons/Place';



require('dotenv');


 
const AnyReactComponent = () => <PlaceIcon />;
let _isMounted = true;
 
class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      center: {
        lat: 59.95,
        lng: 30.33
      },
      zoom: 17,
      loading: true,
      error: false
    }
  }

  getGeocode() {
    this.setState({loading: true})
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API);
    Geocode.enableDebug();

    const fullAddy = `${this.props.street} ${this.props.city}, ${this.props.state}`

    Geocode.fromAddress(fullAddy).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
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
        // if(_isMounted) {
        //   this.setState({
        //     loading: false,
        //     error: true
        //   })
        // }
        console.error(error);
      }
    );
  }
  
  componentDidMount() {
    _isMounted = true;
    this.getGeocode();
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
        <div style={{ height: '50vh', width: '100%', border: '2px solid black', borderRadius: 5 }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API}}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
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