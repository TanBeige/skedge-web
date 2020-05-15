/*eslint-disable*/
import React, {useState} from "react";
import axios from 'axios'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import PinDrop from "@material-ui/icons/PinDrop";
import Phone from "@material-ui/icons/Phone";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";

import contactUsStyle from "assets/jss/material-kit-pro-react/views/contactUsStyle.js";

const policies = require('./policyInfo.json')
require('./privacy.css');


const useStyles = makeStyles(contactUsStyle);

export default function PrivacyPolicyPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const classes = useStyles();
  return (
    <div>
      <Header
        brand="Material Kit PRO React"
        links={<HeaderLinks dropdownHoverColor="dark" />}
        fixed
        color="dark"
      />

      <div className={classNames(classes.main)} style={{marginBottom: '1em', marginTop: '2em'}}>
        <div className={classes.contactContent} style={{textAlign: 'center'}}>
          <div className={classes.container}>
            <GridContainer style={{margin: '0em 1em'}}>
              <GridItem md={12} sm={12}>
                <h2>Skedge Privacy Policy</h2>
                <div className="policy-wrap">
                  <div className='textLeft'>
                    <p>
                      {policies[0].intro}
                    </p>
                  </div>
                  <hr />
                  <div className='textLeft'>
                    <h4>Collection of your Personal Information</h4>
                    <p>{policies[0].collection}</p>
                    <ul>
                      {
                        policies[0].collection_items.map((i, index) => {
                          return(
                            <li key={index}>{i}</li>
                          )
                        })
                      }
                    </ul>
                    <p>If you are an “entity” profile and purchase Skedge's products and services, we collect billing and credit card information. This information is used to complete the purchase transaction.</p>
                    <p>“Entity” - any kind of business (venues, restaurants, performers, bars, apartment complexes, theatres, etc) who signs up on theskedge.com and posts events onto the “Local Event Feed”.</p>
                    <p>“Local Event Feed”: the feed that displays all of the local events in your area. Both “users” and “entities” have a Local Event Feed. </p>
                    <p>“User” - any person who signs up on theskedge.com and uses the website. </p>
                    <p>Skedge may also collect anonymous demographic information, which is not unique to you, such as your:</p>
                    <ul>
                      <li>Gender</li>
                    </ul>
                    <h4>Use of your Personal Information</h4>
                    <p>Skedge collects and uses your personal information to operate its website(s) and deliver the services you have requested.</p>
                    <p>Skedge may also use your personally identifiable information to inform you of other products or services available from Skedge and its affiliates.</p>

                    <h4>Sharing Information with Third Parties</h4>
                    <p>Skedge may sell, rent or lease its customer lists to third parties in the future. </p>
                    <p>Skedge may share data with trusted partners to help perform statistical analysis, send you emails,  or provide customer support. All such third parties are prohibited from using your personal information except to provide these services to Skedge, and they are required to maintain the confidentiality of your information.</p>
                    <p>
                      Skedge may disclose your personal information, without notice, if required to do so by law or in the good faith belief that
                      such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on Skedge or the site; (b) protect and defend the rights or property of Skedge; and/or (c) act under exigent circumstances to protect the personal safety of users of Skedge, or the public.
                    </p>

                    <h4>Tracking User Behavior</h4>
                    <p>Skedge may keep track of the websites and pages our users visit within Skedge, in order to determine what Skedge services are the most popular. This data is used to provide you the best service we possibly can by delivering customized content and advertising within Skedge to customers whose behavior indicates that they are interested in a particular subject area. We track every button that a user clicks/swipes on and how many pageviews per session a user goes on to study key trends within theskedge.com.</p>

                    <h4>Automatically Collected Information</h4>
                    <p>Information about your computer hardware and software may be automatically collected by Skedge. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the Skedge website.</p>

                    <h4>Use of Cookies</h4>
                    <p>The Skedge website may use "cookies" to help you personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.</p>
                    <p>One of the primary purposes of cookies is to provide a convenience feature to save you time. The purpose of a cookie is to tell the Web server that you have returned to a specific page. For example, if you personalize Skedge pages, or register with Skedge site or services, a cookie helps Skedge to recall your specific information on subsequent visits. This simplifies the process of recording your personal information, such as billing addresses, shipping addresses, and so on. When you return to the same Skedge website, the information you previously provided can be retrieved, so you can easily use the Skedge features that you customized.</p>
                    <p>You have the ability to accept or decline cookies. Most Web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of the Skedge services or websites you visit.</p>

                    <h4>Links</h4>
                    <p>This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.</p>

                    <h4>Security of your Personal Information</h4>
                    <p>Skedge secures your personal information from unauthorized access, use, or disclosure. Skedge uses the following methods for this purpose:</p>
                    <ul>
                      <li>SSL Protocol</li>
                      <li>Auth0, Inc.</li>
                      <li>Chargebee</li>
                    </ul>
                    <p>When personal information (such as a credit card number) is transmitted to other websites, it is protected through the use of encryption, such as the Secure Sockets Layer (SSL) protocol.</p>
                    <p>We strive to take appropriate security measures to protect against unauthorized access to or alteration of your personal information. Unfortunately, no data transmission over the Internet or any wireless network can be guaranteed to be 100% secure. As a result, while we strive to protect your personal information, you acknowledge that: (a) there are security and privacy limitations inherent to the Internet which are beyond our control; and (b) security, integrity, and privacy of any and all information and data exchanged between you and us through this Site cannot be guaranteed.</p>

                    <h4>Children Under Thirteen</h4>
                    <p>Skedge does not knowingly collect personally identifiable information from children under the age of thirteen. If you are under the age of thirteen, you must ask your parent or guardian for permission to use this website.</p>

                    <h4>E-mail Communications</h4>
                    <p>From time to time, Skedge may contact you via email for the purpose of providing announcements (Top 5 events of the week for example), promotional offers, alerts, confirmations, surveys, and/or other general communication. In order to improve our Services, we may receive a notification when you open an email from Skedge or click on a link therein.</p>
                    <p>If you would like to stop receiving marketing or promotional communications via email from Skedge, you may opt out of such communications by clicking the UNSUBSCRIBE button.</p>

                    <h4>Push Notifications</h4>
                    <p>Skedge will be sending push notifications to each user and entity from time to time as a reminder about us. </p>

                    <h4>Changes to this Statement</h4>
                    <p>
                      Skedge reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by
                      placing a prominent notice on our site, and/or by updating any privacy information on this page. Your continued use of the Site and/or Services available through this Site after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.
                    </p>

                    <h4>Contact Information</h4>
                    <p>Skedge welcomes your questions or comments regarding this Statement of Privacy. If you believe that Skedge has not adhered to this Statement, please contact Skedge at:</p>
                    <p>Email Address: info@theskedge.com</p>
                    <hr />
                    Effective as of January 06, 2020
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer
        content={
          <div>
            <div className={classes.left}>
              <List className={classes.list}>
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="/"
                    target="_blank"
                    className={classes.block}
                  >
                    Skedge
                  </a>
                </ListItem>
                <ListItem className={classes.inlineBlock}>
                        <a
                            href="/about-us"
                            target="_blank"
                            className={classes.block}
                        >
                            About us
                        </a>
                        </ListItem>
                        <ListItem className={classes.inlineBlock}>
                        <a
                            href="/contact-us"
                            target="_blank"
                            className={classes.block}
                        >
                            Contact us
                        </a>
                        </ListItem>
              </List>
            </div>
          </div>
        }
      />
    </div>
  );
}
