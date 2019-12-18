import React, {Component} from 'react';
import { createMuiTheme } from "@material-ui/core/styles";
import {Link, withRouter} from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';

import Badge from '@material-ui/core/Badge';

//React-Apollo Graphql
import { Subscription } from "react-apollo";

import gql from 'graphql-tag';
import './PrimaryNav.css';
import { ThemeProvider } from '@material-ui/styles';

import {
  QUERY_BOTTOM_NAV
} from 'EventQueries/EventQueries.js';

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
                '/search',
                '/create',
                '/notifications',
                `/users/0`,
            ],
            showBar: true,
            notifs: 0
        };
    }

  static getDerivedStateFromProps(nextProps, prevState) {
    //const {pathname} = nextProps.location;
    //const {pathMap} = this.state;

    if(nextProps.location.pathname !== prevState.path) {
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
      const pathname = this.state.path;
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
  }

  componentDidMount() {
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
              query fetch_user_nav_id($userId: String) {
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
              //Set State variable
              this.setState({
                  pathMap: [
                      '/home',
                      '/search',
                      '/create',
                      '/notifications',
                      `/users/${data.data.users[0].id}`
                  ],
                  //notifs: (data.data.users[0].followers_aggregate.aggregate.count + data.data.users[0].notifications_aggregate.aggregate.count)
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

    // //Refetch Notifications
    // if(value === 3) {
    //   this.props.client.readQuery({
    //     query: QUERY_BOTTOM_NAV,
    //       variables: {
    //         userId: this.props.userId
    //       }
    //   })
    // }
  };

  render() {
    const {value, pathMap, showBar} = this.state;
    if (showBar) {
      return (
        <ThemeProvider theme={theme}>
          <Subscription subscription={QUERY_BOTTOM_NAV} variables={{userId: this.props.userId}} >
            {({ loading, error, data }) => {
              let notifNums = 0;
              if (loading) {
                notifNums = 0;
              }
              else if (error) {
                notifNums = 0;
                console.log("Navbar Error: ",error)
              } 
              else {
                notifNums = (data.users[0].followers_aggregate.aggregate.count + data.users[0].notifications_aggregate.aggregate.count)
              }
              return (
                <BottomNavigation
                  value={value}
                  onChange={this.handleChange}
                  className="nav primary"
                >
                  <BottomNavigationAction label="Feeds" icon={<DynamicFeedIcon />} component={Link} to={pathMap[0]} />
                  <BottomNavigationAction label="Search" icon={<SearchIcon />} component={Link} to={pathMap[1]} />
                  <BottomNavigationAction label="Create" icon={<AddCircleOutlineIcon />} component={Link} to={pathMap[2]} />
                  <BottomNavigationAction label="Notifications" icon={<Badge badgeContent={notifNums} max={999} overlap="circle" color="secondary"><NotificationsIcon /></Badge>} component={Link} to={pathMap[3]} />
                  <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} component={Link} to={pathMap[4]} />
                </BottomNavigation>
              );
            }}
          </Subscription>
        </ThemeProvider>
      );
    }
    else {
      return null;
    }
  }
}

export default withRouter(PrimaryNav);