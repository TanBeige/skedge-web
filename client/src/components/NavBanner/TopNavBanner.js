import React from 'react';
import AppBar from '@material-ui/core/AppBar'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Toolbar, MenuItem, SvgIcon } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton'

// Menu
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search'
import ListItemText from '@material-ui/core/ListItemText';

// Styling Menu Items
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    height: '2.5em'
  },
  bar: {
    //height: '4em'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(4),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    height: '5em'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 200,
      '&:focus': {
        width: 250,
      },
    },
  },
}))


//Styling Menu
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function HomeIcon(props) {
  return (
    <SvgIcon {...props}> 
      <path d="M193 134l52-51h-51l-38 40 6-109-35 46-2 26q-10-6-25-10l-12-3a63 63 0 0 1-10-3 25 25 0 0 1-8-5 11 11 0 0 1-4-7 13 13 0 0 1 5-12q5-5 14-5a45 45 0 0 1 15 1c7 2 9 2 14 6l35-40a550 550 0 0 0-74-6 74 74 0 0 0-25 7 56 56 0 0 0-19 13 54 54 0 0 0-11 20 64 64 0 0 0-2 24q1 14 6 22a43 43 0 0 0 12 14 56 56 0 0 0 16 8l18 4 13 4a39 39 0 0 1 10 4 15 15 0 0 1 5 5 16 16 0 0 1 2 7q0 7-5 13t-17 6a50 50 0 0 1-20-3 81 81 0 0 1-22-12L3 178c24 14 58 16 81 15a92 92 0 0 0 29-7 75 75 0 0 0 6-3v10h37v-45l40 45h52z" />
    </SvgIcon>
  )
}

// Creating NavBar
export default function TopNavBar(props) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  function onSearchInput(e) {
    props.handleSearch(e.target.value);
    e.preventDefault();
  }

  // For Menu
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }


  return (
    <div className={classes.root}>
      <AppBar className={classes.bar} position='static'>
        <Toolbar>
          {/* Menu Button Left of Searchbar */}
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={handleClick}>
            <HomeIcon />
          </IconButton>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem>
              <ListItemText>Terms</ListItemText>
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText>Privacy</ListItemText>
            </StyledMenuItem>
          </StyledMenu>

          {/* Search Bar */}
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
              fullWidth
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}