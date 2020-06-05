/*!

=========================================================
* Material Kit PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui icons
import Subject from "@material-ui/icons/Subject";
import WatchLater from "@material-ui/icons/WatchLater";
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";

import { Link } from 'react-router-dom';

import cardsStyle from "assets/jss/material-kit-pro-react/views/componentsSections/sectionCards.js";

const style = {
  ...cardsStyle
};

const useStyles = makeStyles(style);

var cloudinary = require('cloudinary/lib/cloudinary').v2

cloudinary.config({
  cloud_name: "skedge"
});

export default function ItemCard({itemType, itemId, name, picId, location_name}) {
  const classes = useStyles();

  const spacesRemoved = name.replace(/\s/g, '-');
  let itemUrl = `/events/${itemId}-${encodeURIComponent(spacesRemoved)}`;
  if(itemType === "deal") {
    itemUrl = `/deals/${itemId}-${encodeURIComponent(spacesRemoved)}`;
  }

  const picUrl = cloudinary.url(picId, {secure: true, width: 900, crop: "scale", fetch_format: "auto", quality: "auto"})

  const gotoDeal = () => {
    // window.location.href = `skedge://skedge/Deal?itemId=${itemId}`

  }

  return(
    <div>
      <div>
        <img src={picUrl} style={{height: 150, width: '100%', objectFit: 'cover'}}/>
      </div>
    </div>
  )
  // return (
  //   <Card
  //     background
  //     style={{
  //       backgroundImage: `url(${picUrl})`,
  //       marginBottom: 10,
  //       marginTop: '1em',
  //       borderRadius: 0,
  //     }}
  //   >
  //       {/* <a href={`skedge://skedge/Deal?itemId=${itemId}`}> */}
  //       {/* <Link to={itemUrl}> */}

  //           <CardBody background style={{minHeight: '130px'}}>
              
  //               <h3 className={classes.cardTitleWhite} style={{margin: 0}}>
  //                   {name}
  //               </h3>
  //           </CardBody>
  //       {/* </a> */}
  //       {/* </Link> */}
  //   </Card>
  // );
}