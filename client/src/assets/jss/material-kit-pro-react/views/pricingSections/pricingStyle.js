import {
  mrAuto,
  mlAuto,
  cardTitle,
  primaryColor,
  whiteColor,
  infoColor,
  hexToRgb
} from "assets/jss/material-kit-pro-react.js";

const pricingStyle = {
  primaryColor,
  mrAuto,
  mlAuto,
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: whiteColor + " !important",
    "& small": {
      color: "rgba(" + hexToRgb(whiteColor) + ",0.8)!important"
    }
  },
  textCenter: {
    textAlign: "center"
  },
  pricingSection: {
    padding: "80px 0px"
  },
  textInfo: {
    color: infoColor[0] + " !important"
  },

  '@global': {
    body: {
      backgroundColor: whiteColor,
    },
  },
  paper: {
    marginTop: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: '1em',
    backgroundColor: whiteColor,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '2em',
  },
  submit: {
    margin: '3em, 0em, 2em',
    height: '4em'
  },
};

export default pricingStyle;
