import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import { Link } from 'react-router-dom';

import SkedgeTitle from '../components/SkedgeTitle';
import LoginButtons from '../components/LoginButtons';


const backgroundImage =
  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

let imgUrl = 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2740&q=80'

if (window.innerWidth < 760)
  imgUrl = 'https://images.unsplash.com/photo-1523650954327-a525a8fb55ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'

const styles = theme => ({
  background: {
    backgroundImage: `url(${imgUrl})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  h5: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(5),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

const ProductHero = (props) => {
  const { classes } = props;

  const { isAuthenticated } = props.auth;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      {isAuthenticated() && (
        <Link to="/home">Realtime React Todo App Demo</Link>
      )}
      <img style={{ display: 'none' }} src={backgroundImage} alt="" />
      <SkedgeTitle {...props}/>
      <LoginButtons {...props}/>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Local events. Found instantly.
      </Typography>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Discover the experience
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
