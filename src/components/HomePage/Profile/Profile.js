import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import auth from "../../Auth/Auth";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    
    login() {
        this.props.auth.login();
      }
    logout() {
        this.props.auth.logout();
    }

    render() { 
    const { isAuthenticated } = this.props.auth;

    return ( 
        <div>
            <Button
            id="qsLoginBtn"
            variant='contained'
            color="primary"
            onClick={this.logout.bind(this)}
            >
            Logout
            </Button>
        </div>
        )
    }
}
 
export default Profile;