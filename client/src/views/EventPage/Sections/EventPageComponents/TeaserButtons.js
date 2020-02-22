import React, {useEffect, useState, Fragment} from 'react';
import Button from 'components/CustomButtons/Button.js'
import { makeStyles } from '@material-ui/core/styles';

import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import RenewIcon from '@material-ui/icons/Autorenew';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';



const useStyles = makeStyles(theme => ({
    typography: {
      padding: theme.spacing(1),
      textAlign: 'center'
    },
  }));

export default function GoingSaveButtons (props) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    // Buttons
    const goingButton = (
        <Fragment>
            <Button className='buttonMargin' round color="primary" onClick={handleClick}>
                Go
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div className={classes.typography}>
                    <Typography >Sign up to perform this action.</Typography>
                    <Button color='primary' round>Sign Up/Login</Button>
                </div>
            </Popover>
        </Fragment>
    )
    const saveButton = (
      <Tooltip title="Save event for later"  placement="top">
        <Button className='buttonMargin' justIcon round size='sm' style={{backgroundColor: '#5F60F5'}} onClick={handleClick}>
            <TurnedInNotIcon fontSize='small'/>
        </Button>
      </Tooltip> 
    )
    const repostButton = (
      <Tooltip title="Share to your followers"  placement="top">
        <Button className='buttonMargin' justIcon round size='sm' color='white' onClick={handleClick}>
            <RenewIcon fontSize='small'/>
        </Button>
      </Tooltip>
    )

    return (
        <div style={{height: '4em', display: 'inline-block', marginBottom: '-50%'}}>
            {repostButton}

            {goingButton}

            {saveButton}
        </div>
    )
}