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
            path: props.location.pathname,
            pathMap: [
                '/home',
                '/create',
                '/notifications',
                `/users/0`,
            ],
            showBar: true,
        };
    }

  static getDerivedStateFromProps(nextProps, prevState) {
    //const {pathname} = nextProps.location;
    //const {pathMap} = this.state;
    console.log(nextProps)

    if(nextProps.location.pathname !== prevState.path) {
      console.log("np",nextProps.location.pathname)
      return {path: nextProps.location.pathname}
    }
    else {
      return null
    }


    //if(nextProps.location)

    //const value = pathMap.indexOf(pathname);

    // if (pathname === "/create" || pathname === "/" || pathname === "/error-page") {
    //   this.setState({
    //     showBar: false
    //   })
    // }
    // else {
    //   this.setState({
    //     showBar: true
    //   })
    // }

    // if (value > -1) {
    //   this.setState({
    //     value
    //   });
    // }
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.path !== this.state.path) {
      console.log("run")
      const pathname = this.state.path;
      const {pathMap} = this.state;
      console.log(pathname)

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
  }

  componentDidMount() {
    console.log("Mounting BottomNav")

    if (this.props.location.pathname === "/create" || this.props.location.pathname === "/" || this.props.location.pathname === "/error-page") {
      this.setState({
        showBar: false
      })
    }
    else {
      this.setState({
        showBar: true
      })
    }
    //Set current Page View
    const {pathMap} = this.state  
    const value = pathMap.indexOf(this.state.path);
    if (value > -1) {
      this.setState({value});
    }


    //let newPathMap = [];
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
              //Set Current Variable
            //   newPathMap = [
            //     '/home',
            //     '/create',
            //     '/notifications',
            //     `/users/${data.data.users[0].id}`
            // ]

              //Set State variable
              this.setState({
                  pathMap: [
                      '/home',
                      '/create',
                      '/notifications',
                      `/users/${data.data.users[0].id}`
                  ]
              })

              //Set current Page View
              if(this.state.path.includes("/users/")) {
                const {pathMap} = this.state  
                const value = pathMap.indexOf(this.state.path);
                if (value > -1) {
                  this.setState({value});
                }
              }
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