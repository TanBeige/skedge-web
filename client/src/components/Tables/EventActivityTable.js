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
// material-ui icons
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
// core components
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";

import style from "assets/jss/material-kit-pro-react/views/componentsSections/contentAreas.js";

const useStyles = makeStyles(style);

export default function EventActivityTable({impressions, views, shares, likes, going}) {

    console.log(impressions)
    console.log(views)
    console.log(shares)
    console.log(likes)
    console.log(going)

  const classes = useStyles();
  const fillButtons = [
    { color: "info", icon: Person },
    { color: "success", icon: Edit },
    { color: "danger", icon: Close }
  ].map((prop, key) => {
    return (
      <Button justIcon size="sm" color={prop.color} key={key}>
        <prop.icon />
      </Button>
    );
  });
  const simpleButtons = [
    { color: "info", icon: Person },
    { color: "success", icon: Edit },
    { color: "danger", icon: Close }
  ].map((prop, key) => {
    return (
      <Button simple justIcon size="sm" color={prop.color} key={key}>
        <prop.icon />
      </Button>
    );
  });
  const roundButtons = [
    { color: "info", icon: Person },
    { color: "success", icon: Edit },
    { color: "danger", icon: Close }
  ].map((prop, key) => {
    return (
      <Button round justIcon size="sm" color={prop.color} key={key}>
        <prop.icon />
      </Button>
    );
  });
  return (
    <Table
    //   tableHead={["Name", "Job Position", "Since", "Salary", "Actions"]}
      tableData={[
        ["Impressions", impressions],
        ["Views", views],
        ["Likes", likes],
        ["Shares", shares],
        ["Going", going]
      ]}
      customCellClasses={[
        classes.textCenter,
        classes.textRight,
        classes.textRight
      ]}
    //   customClassesForCells={[0, 4, 5]}
      customHeadCellClasses={[
        classes.textCenter,
        classes.textRight,
        classes.textRight
      ]}
    //   customHeadClassesForCells={[0, 4, 5]}
    />
  );
}