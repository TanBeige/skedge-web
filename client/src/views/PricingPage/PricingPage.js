/*eslint-disable*/
import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";
// sections for this page
import SectionPricing from "views/PricingPage/Sections/SectionPricing.js";
import SectionFeatures from "views/PricingPage/Sections/SectionFeatures.js";

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingStyle.js";

const useStyles = makeStyles(pricingStyle);

export default function PricingPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();

  const [values, setValues] = useState({
    currentPage: 0,
      goingBack: false,

      event_type: "",
      street: "",
      city: "",
      state: "",
      zip_code: 0,

      name: "",
      description: "",
      event_date: "",
      start_time: "",
      end_time: "",
      price: "0.00",
      allow_invites: false,
      host_approval: false,
      web_url: "",
      cover_pic: "",
      repeat_days: false,

      category: "",
      tags: [],

      cohost_id: []
  });

  // Functions
  const handleGoBack = () => {
    if (this.state.currentPage > 0) {
        this.setState({
            currentPage: this.state.currentPage - 1,
            goingBack: true
        })
    }
    else {
        let path = `home`;
        this.props.history.push(path);
        // eslint-disable-next-line
        /*window.location.reload()*/
    }
  }

// Page 0: Loca or Private Choosing
const handleLocalOrPrivate = (type) => {
    this.setState({
        currentPage: this.state.currentPage + 1,
        goingBack: false,

        event_type: type
    });
}
// Page 1: Event Info Submission
  const handleTagInfo = (cat, inTags) => {
    let newTags = [];
    let i;
    for(i = 0; i < inTags.length; i++){
        newTags.push({
            tag: {
                    data: { name: inTags[i] },
                    "on_conflict": {
                        "constraint": "tags_name_key",
                        "update_columns": "name"
                    }
                }
            }
    )};
    
    console.log(newTags);
    this.setState({
        currentPage: this.state.currentPage + 1,
        goingBack: false,

        category: cat,
        tags: newTags
    });
}

  const handleEventInfo =(
    name,
    address,
    city,
    state,
    event_date,
    start_time,
    end_time,
    description,
    repeat_days
  ) => {
    this.setState({
      currentPage: this.state.currentPage + 1,
      goingBack: false,

      name: name,
      description: description,
      street: address,
      city: city,
      state: state,
      event_date: event_date,
      start_time: start_time,
      end_time: end_time,
      repeat_days: repeat_days,
    });
  }

  const handleCohost = (cohostId) => {
    this.setState({
        currentPage: this.state.currentPage + 1,
        goingBack: false,

        cohost_id: cohostId
    });
  }

/**
 * This function finally submits all the information received from the user.
 * Import bannerImg so we don't have to put it in the state.
 */
  const submitEvent = async (bannerImg) => {
    console.log("State: ", this.state);

    const form_data = new FormData();

    form_data.append('file', bannerImg)
    console.log(form_data)

    // Upload file to DigitalOcean
    const response = await axios.post(`/storage/upload`, form_data);

    // Grabs image info and adds uploaded file ID to cover_pic in events table.
    console.log(response);
    console.log(response.data)

    // Inputs all information into Hasura Postgres DB via GraphQL
    this.props.client.mutate({
        mutation: gql`
        mutation insert_events($objects: [events_insert_input!]!) {
            insert_events(objects: $objects) {
                affected_rows
                returning {
                id
                name
                description
                created_at
                updated_at
                image {
                    image_name
                }
                event_tags {
                    tag {
                    name
                    id
                    }
                    tag_id
                    event_id
                }
                }
            } 
        }
      `,
        variables: {
            objects: [
                {
                    creator_id: auth.getSub(),
                    cohost_id: this.state.cohost_id,
                    event_type: this.state.event_type,
                    name: this.state.name,
                    description: this.state.description,
                    event_date: this.state.event_date,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time,
                    price: this.state.price,
                    //allow_invites: this.state.allow_invites,
                    //host_approval: this.state.host_approval,
                    category: this.state.category,

                    street: this.state.street,
                    city: this.state.city,
                    state: this.state.state,

                    image: {
                        data: {
                            image_name: bannerImg.name,
                            image_uuid: response.data.id,
                            url: response.data.url,
                            content_type: bannerImg.type,
                        }
                    },
                    event_tags: {
                        data: this.state.tags
                    }
                }
            ],
            
        },
    }).then(() =>{
        let path = `home`;
        this.props.history.push(path);
    })

    /*let path = `home`;
    this.props.history.push(path);
    // eslint-disable-next-line
    window.location.reload()*/
  }

  return (
    <div style={{backgroundColor: "blue"}}>
      <div style={{height: '3em'}}></div>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <h2 style={{textAlign: 'center'}}><strong>Create Event</strong></h2>
          <hr />
          <SectionPricing />
        </div>
      </div>
      <div style={{height: '2em'}}></div>
    </div>
  );
}
