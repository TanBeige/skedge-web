import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import workStyle from "assets/jss/material-kit-pro-react/views/landingPageSections/workStyle.js";

const useStyles = makeStyles(workStyle);

export default function SectionWork() {
  const classes = useStyles();
  return (
    <div className={classes.section} style={{padding: 0}}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={8} md={8}>
          <h2 className={classes.title}>Display Events for Everyone</h2>
          <h4 className={classes.description}>
            On Skedge, after being verified, you can post events to our local feed. 
            This will allow everyone in your community to know about your event! <br />
            Create you account and send us a message:
          </h4>
          <form>
            <GridContainer>
              <GridItem xs={12} sm={6} md={6}>
                <CustomInput
                  labelText="Your Name"
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={6} md={6}>
                <CustomInput
                  labelText="Your Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
              <CustomInput
                labelText="Your Message"
                id="message"
                formControlProps={{
                  fullWidth: true,
                  className: classes.textArea
                }}
                inputProps={{
                  multiline: true,
                  rows: 5
                }}
              />
              <GridItem
                xs={12}
                sm={4}
                md={4}
                className={classes.mrAuto + " " + classes.mlAuto}
              >
                <Button color="primary">Send Message</Button>
              </GridItem>
            </GridContainer>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
