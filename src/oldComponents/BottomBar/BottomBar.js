import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { makeStyles } from '@material-ui/core/styles';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { mergeClasses } from '@material-ui/styles';

require('./BottomBar.scss');

const useStyles = makeStyles({
    stickToBottom: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      height: '4em'
    },
});   

export default function BottomBar() {
    const classes = useStyles();
    const [value, setValue] = React.useState('feed');

    function handleChange(event, newValue) {
      setValue(newValue);
    }
  
    return (
      <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
        <BottomNavigationAction label="Feed" value="feed" icon={<RestoreIcon />} component={Link} to={'/home'}/>
        <BottomNavigationAction label="Create Event" value="create" icon={<FavoriteIcon />} component={Link} to={'/create'}/>
        <BottomNavigationAction label="notifications" value="notifications" icon={<LocationOnIcon />} component={Link} to={'/notifications'}/>
        <BottomNavigationAction label="Profile" value="profile" icon={<RestoreIcon />} component={Link} to={`/user/`}/>
      </BottomNavigation>
    );
}
