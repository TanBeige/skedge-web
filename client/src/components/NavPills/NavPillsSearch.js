import React, {useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Collapse from '@material-ui/core/Collapse';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';





import styles from "assets/jss/material-kit-pro-react/components/navPillsStyle.js";
import { Button } from "@material-ui/core";

import DateSelect from 'views/HomePage/Sections/DateSelect.js';
import SearchFilterBar from 'views/HomePage/Sections/SearchFilterBar.js';


const useStyles = makeStyles(styles);

const tableButtonStyle = {
  borderRadius: 20,
  fontSize: 12,
  padding: "2px 4px",
  margin: "5px 2px 0px 2px"
}
const tableButtonSelectedStyle = {
  //Differences : in the future? didn't think I wouldn't need this...

  //Similarities
  borderRadius: 20,
  fontSize: 12,
  padding: "2px 4px",
  margin: "5px 2px 0px 2px"
}

export default function NavPillsSearch(props) {
  const [expanded, setExpanded] = useState(false)

  const [active, setActive] = React.useState(props.active);
  const [tableValue, setTableValue] = React.useState(0);
  const handleChange = (event, active) => {
    setActive(active);
    props.setLastTab(active);
  };
  const handleChangeIndex = index => {
    setActive(index);
  };
  const handletableChange = index => {
    setTableValue(index)
  }
  // Expand Filter
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const { tabs, userSearch, direction, color, horizontal, alignCenter } = props;
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
            disabled={prop.tabButton === "Following" && props.isEntity}
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
  if (active === 0 ) {
    tabContent = (
      <div>
        <div className={classes.tabContent} >
          {tabs[0].tabContent}
        </div>
      </div>
    )
  }
  else if (active === 1 ) {
    tabContent = (
      <div>
        <div className={classes.tabContent} >
          {tabs[1].tabContent}
        </div>
      </div>
    )
  }
  else if (active === 2 ) {
    tabContent = (
      <div>
        <div className={classes.tabContent} >
          {tabs[2].tabContent}
        </div>
      </div>
    )
  }

  return horizontal !== undefined ? (
    <GridContainer>
      <GridItem {...horizontal.tabsGrid}>{tabButtons}</GridItem>

      <IconButton style={{position: 'absolute', top: '2em', right: '0', padding: '8px',backgroundColor: 'white', border: window.innerWidth < 350 ? '1px solid darkgrey' : "none"}} onClick={handleExpandClick}>
        <SearchIcon />
      </IconButton>
      <Collapse in={expanded} timeout="auto">
        <SearchFilterBar handleFilters={props.handleFilters} handleDateChange={props.handleDateChange} submitSearch={props.submitSearch} values={props.values}/>
      </Collapse>
      
      <DateSelect handleDayBack={props.handleDayBack} handleDayForward={props.handleDayForward} date={props.formattedDate}/>
      
      <GridItem {...horizontal.contentGrid}>{tabContent}</GridItem>
    </GridContainer>
  ) : (
    //I think this is the one that gets show every time
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} style={{paddingLeft: 0, paddingRight: 0}} className={classes.textCenter}>
          {/* {tabButtons} */}
          
          <IconButton style={{position: 'absolute', top: '0em', right: '0', padding: '8px',backgroundColor: 'white', border: window.innerWidth < 350 ? '1px solid darkgrey' : "none", zIndex: 5}} onClick={handleExpandClick}>
            <SearchIcon/>
          </IconButton>
          <Collapse in={expanded} timeout="auto">
            <SearchFilterBar handleFilters={props.handleFilters} handleDateChange={props.handleDateChange} submitSearch={props.submitSearch} values={props.values}/>
          </Collapse>

          <div >
            <p style={{fontSize: 28, textAlign: 'center', margin: 8}}>Deals</p>
            <DateSelect handleDayBack={props.handleDayBack} handleDayForward={props.handleDayForward} date={props.formattedDate}/>
          </div>
          
          {tabContent}
        </GridItem>
      </GridContainer>
    </div>
  );
}

NavPillsSearch.defaultProps = {
  active: 0,
  color: "primary"
};

NavPillsSearch.propTypes = {
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

const tableTypeList = [
  {
    label: "events"
  },
  {
    label: "users"
  },
]