import React, {Component} from 'react';
import { createMuiTheme } from "@material-ui/core/styles";
import {Link, withRouter} from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import gql from 'graphql-tag';
import './PrimaryNav.css';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#02C39A"
      }
    },
  });

class PrimaryNav extends Component {
    constructor(props) {
        super(props)

        //Get userID for profile click
    
        this.state = {
            value: 0,
            pathMap: [
                '/home',
                '/create',
                '/notifications',
                `/users/0`,
            ],
            showBar: true,
            authenticated: props.isAuthenticated
        };
    }

  componentWillReceiveProps(newProps) {
    const {pathname} = newProps.location;
    const {pathMap} = this.state;

    const value = pathMap.indexOf(pathname);

    if (pathname === "/create" || pathname === "/" || pathname === "/error-page") {
      this.setState({
        showBar: false
      })
    }
    else {
      this.setState({
        showBar: true
      })
    }

    if (value > -1) {
      this.setState({
        value
      });
    }
  }

  componentDidMount() {
    if(this.props.client) {
        this.props.client.query({
            query: gql`
              query fetch_user_id($userId: String) {
                  users(
                  where: {auth0_id: { _eq: $userId }}
                  ) {
                    id
                  }
              }
            `,
            variables: {
              userId: this.props.userId
            }
        }).then((data) => {
            if(data.data.users[0]){
              this.setState({
                  pathMap: [
                      '/home',
                      '/create',
                      '/notifications',
                      `/users/${data.data.users[0].id}`
                  ]
              })
            }
        });
    }
  }



  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {value, pathMap, showBar} = this.state;
    if (showBar) {
      return (
          <ThemeProvider theme={theme}>
              <BottomNavigation
                  value={value}
                  onChange={this.handleChange}
                  className="nav primary"
              >
                  <BottomNavigationAction label="Feeds" icon={<DynamicFeedIcon />} component={Link} to={pathMap[0]} />
                  <BottomNavigationAction label="Create" icon={<AddCircleOutlineIcon />} component={Link} to={pathMap[1]} />
                  <BottomNavigationAction label="Notifications" icon={<NotificationsIcon />} component={Link} to={pathMap[2]} />
                  <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} component={Link} to={pathMap[3]} />
              </BottomNavigation>
          </ThemeProvider>
      );
    }
    else {
      return null;
    }
  }
}

export default withRouter(PrimaryNav);