import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    height: '2.5em'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(8),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(4),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(8),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    height: '3em'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 3),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    }
  }
}))




export default function TopNavBar(props) {
  const classes = useStyles()

  function onSearchInput(e) {
    props.handleSearch(e.target.value);
    e.preventDefault();
  }

    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search Events…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'Search' }}
                onChange={onSearchInput} 
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
}