import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import EventCardList from '../EventCards/EventCardList';

import styles from "assets/jss/material-kit-pro-react/components/navPillsStyle.js";

const useStyles = makeStyles(styles);

export default function NavPillsProfile(props) {
  const [active, setActive] = React.useState(props.active);
  const handleChange = (event, active) => {
    setActive(active);
  };
  const handleChangeIndex = index => {
    setActive(index);
  };
  const { tabs, direction, color, horizontal, alignCenter } = props;
  const classes = useStyles();
  const flexContainerClasses = classNames({
    [classes.flexContainer]: true,
    [classes.horizontalDisplay]: horizontal !== undefined
  });
  const tabButtons = (
    <Tabs
      classes={{
        root: classes.root,
        fixed: classes.fixed,
        flexContainer: flexContainerClasses,
        indicator: classes.displayNone
      }}
      value={active}
      onChange={handleChange}
      centered={alignCenter}
      // style={{
      //   margin: 0,
      //   width: '5em'
      // }}
    >
      {tabs.map((prop, key) => {
        var icon = {};
        if (prop.tabIcon !== undefined) {
          icon["icon"] = <prop.tabIcon className={classes.tabIcon} />;
        }
        const pillsClasses = classNames({
          [classes.pills]: true,
          [classes.horizontalPills]: horizontal !== undefined,
          [classes.pillsWithIcons]: prop.tabIcon !== undefined
        });
        return (
          <Tab
            label={prop.tabButton}
            key={key}
            {...icon}
            classes={{
              root: pillsClasses,
              label: classes.label,
              selected: classes[color]
            }}
          />
        );
      })}
    </Tabs>
  );
  
  let tabContent = "";
  if(active === 0) {
    tabContent = (
      <div className={classes.contentWrapper}>
        <div className={classes.tabContent} >
          {tabs[0].tabContent}
        </div>
      </div>
    )
  }
  else if(active === 1) {
    tabContent = (
      <div className={classes.contentWrapper}>
        <div className={classes.tabContent} >
          {tabs[1].tabContent}
        </div>
      </div>
    )
  }
  else {
    tabContent = (
      <div className={classes.contentWrapper}>
        <div className={classes.tabContent} >
          {tabs[2].tabContent}
        </div>
      </div>
    )
  }

  return horizontal !== undefined ? (
    <GridContainer>
      <GridItem {...horizontal.tabsGrid}>{tabButtons}</GridItem>
      <GridItem {...horizontal.contentGrid}>{tabContent}</GridItem>
    </GridContainer>
  ) : (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} className={classes.textCenter}>
          {tabButtons}      
          {tabContent}
        </GridItem>
      </GridContainer>
    </div>
  );
}

NavPillsProfile.defaultProps = {
  active: 0,
  color: "primary"
};

NavPillsProfile.propTypes = {
  // index of the default active pill
  active: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabButton: PropTypes.string,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node
    })
  ).isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose"
  ]),
  direction: PropTypes.string,
  horizontal: PropTypes.shape({
    tabsGrid: PropTypes.object,
    contentGrid: PropTypes.object
  }),
  alignCenter: PropTypes.bool
};
