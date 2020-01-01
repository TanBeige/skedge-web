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
import React, { Fragment } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui icons
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';

// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";



import imagesStyles from "assets/jss/material-kit-pro-react/imagesStyles.js";

import { cardTitle } from "assets/jss/material-kit-pro-react.js";

const style = {
  ...imagesStyles,
  cardTitle
};

const useStyles = makeStyles(style);

export default function EventInviteItem(props) {
    const classes = useStyles();

    return(
        <Fragment>
            <GridItem xs={12} md={6} lg={4}>
                <Card>
                    <img
                        style={{ height: "180px", width: "100%", display: "block" }}
                        className={classes.imgCardTop}
                        src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22320%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_163df23d717%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_163df23d717%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22119.0859375%22%20y%3D%2297.35%22%3E320x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                        alt="Card-img-cap"
                    />
                    <CardBody>
                        <h4 className={classes.cardTitle}>{props.eventItem.event.name}</h4>
                        <IconButton color="primary" edge="end" aria-label="accept">
                            <CheckCircleOutlineIcon fontSize='large'/>
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" >
                            <DeleteIcon fontSize='large'/>
                        </IconButton>
                    </CardBody>
                </Card>
            </GridItem>
        </Fragment>
    )
}




