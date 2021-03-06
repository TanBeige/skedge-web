import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import styles from "assets/jss/material-kit-pro-react/components/parallaxStyle.js";

const useStyles = makeStyles(styles);

export default function Parallax(props) {
  let windowScrollTop;
  if (window.innerWidth >= 768) {
    windowScrollTop = window.pageYOffset / 3;
  } else {
    windowScrollTop = 0;
  }
  const [transform, setTransform] = React.useState(
    "translate3d(0," + windowScrollTop + "px,0)"
  );
  React.useEffect(() => {
    if (window.innerWidth >= 768) {
      window.addEventListener("scroll", resetTransform);
    }
    return function cleanup() {
      if (window.innerWidth >= 768) {
        window.removeEventListener("scroll", resetTransform);
      }
    };
  });
  const resetTransform = () => {
    var windowScrollTop = window.pageYOffset / 3;
    setTransform("translate3d(0," + windowScrollTop + "px,0)");
  };
  const { filter, className, children, style, image, small } = props;
  const classes = useStyles();
  const parallaxClasses = classNames({
    [classes.parallax]: true,
    [classes[filter + "Color"]]: filter !== undefined,
    [classes.small]: small,
    [className]: className !== undefined
  });

  // Changing parallax image based on window width and Time.
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  

    //images
  const wideNightImage = require("assets/img/bg2.jpg");
  const wideDayImage = require("assets/img/bg7.jpg")
  //const image // This props is sent in
  let useImage;
  const loc = window.location.pathname 
  if(loc.includes("/home")) {
    if (window.innerWidth >= 768){
      // If before 6:00pm
      if(today.getHours() < 18) {
        useImage = `url("${wideDayImage}")`
      }
      // If past 6:00pm
      else {
        useImage = `url("${wideNightImage}")`
      }

    }
    else {
      // If before 6:00pm
      if(today.getHours() < 18) {
        useImage = `url("${wideDayImage}")`
      }
      // If past 6:00pm
      else {
        useImage = `url("${image}")`
      }
    }
  }
  else {
    useImage = `url("${image}")`;
  }

  // Render
  return (
    <div
      className={parallaxClasses}
      style={{
        ...style,
        backgroundImage: useImage,
        transform: transform
      }}
    >
      {children}
    </div>
  );
}

Parallax.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.oneOf([
    "primary",
    "rose",
    "dark",
    "info",
    "success",
    "warning",
    "danger"
  ]),
  children: PropTypes.node,
  style: PropTypes.string,
  image: PropTypes.string,
  small: PropTypes.bool
};
