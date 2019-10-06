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
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";
// sections for this page
import SectionPricing from "views/PricingPage/Sections/SectionPricing.js";
import LocalOrPrivate from 'views/PricingPage/Sections/LocalOrPrivate.js';
import EventCreateInfo from 'views/PricingPage/Sections/EventCreateInfo.js';
import TagSelect from 'views/PricingPage/Sections/TagSelect.js';
import AddCohost from 'views/PricingPage/Sections/AddCohost/AddCohost.js';
import AddBanner from 'views/PricingPage/Sections/AddBanner.js';

import pricingStyle from "assets/jss/material-kit-pro-react/views/pricingStyle.js";
import { useAuth0 } from 'Authorization/react-auth0-wrapper.js'

const useStyles = makeStyles(pricingStyle);

export default function PricingPage(props) {

  console.log("props blog: ", props);

  const { user } = useAuth0();


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
    if (values.currentPage > 0) {
        setValues({
            currentPage: values.currentPage - 1,
            goingBack: true
        })
    }
    else {
        let path = `home`;
        props.history.push(path);
        // eslint-disable-next-line
        /*window.location.reload()*/
    }
  }

// Page 0: Loca or Private Choosing
const handleLocalOrPrivate = (type) => {
    setValues({
        currentPage: values.currentPage + 1,
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
    setValues({
        currentPage: values.currentPage + 1,
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
    setValues({
      currentPage: values.currentPage + 1,
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
    setValues({
        currentPage: values.currentPage + 1,
        goingBack: false,

        cohost_id: cohostId
    });
  }

/**
 * This function finally submits all the information received from the user.
 * Import bannerImg so we don't have to put it in the state.
 */
  const submitEvent = async (bannerImg) => {
    console.log("SubmitEvnt Values: ", values);

    const form_data = new FormData();

    form_data.append('file', bannerImg)
    console.log(form_data)

    // Upload file to DigitalOcean
    const response = await axios.post(`/storage/upload`, form_data);

    // Grabs image info and adds uploaded file ID to cover_pic in events table.
    console.log(response);
    console.log(response.data)

    // Inputs all information into Hasura Postgres DB via GraphQL
    props.client.mutate({
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
                    cohost_id: values.cohost_id,
                    event_type: values.event_type,
                    name: values.name,
                    description: values.description,
                    event_date: values.event_date,
                    start_time: values.start_time,
                    end_time: values.end_time,
                    price: values.price,
                    //allow_invites: values.allow_invites,
                    //host_approval: values.host_approval,
                    category: values.category,

                    street: values.street,
                    city: values.city,
                    state: values.state,

                    image: {
                        data: {
                            image_name: bannerImg.name,
                            image_uuid: response.data.id,
                            url: response.data.url,
                            content_type: bannerImg.type,
                        }
                    },
                    event_tags: {
                        data: values.tags
                    }
                }
            ],
            
        },
    }).then(() =>{
        let path = `home`;
        props.history.push(path);
    })

    /*let path = `home`;
    props.history.push(path);
    // eslint-disable-next-line
    window.location.reload()*/
  }

  // Handling What page displays here:
  let currentPageNumber = values.currentPage;
  let appBarTitle = "";
  let page = "";

  switch(currentPageNumber) {
    case 0:
      appBarTitle = "Create An Event";
      page = <LocalOrPrivate goingBack={values.goingBack} handleLocalOrPrivate={handleLocalOrPrivate}/>
      break;
    case 1:
      appBarTitle = "Create An Event";
      page = <EventCreateInfo goingBack={values.goingBack} handleEventInfo={handleEventInfo} />
      break;
    case 2:
      appBarTitle = "Category";
      page = <TagSelect goingBack={values.goingBack} handleTagInfo={handleTagInfo} />
      break;
    case 3:
      appBarTitle = "Add A Cohost";
      page = <AddCohost 
        goingBack={values.goingBack} 
        handleCohost={handleCohost} 
        client={props.client}
        userId={auth.getSub()}
        event_type={values.event_type}
      />
      break;
    case 4:
      appBarTitle = "Banner";
      page = <AddBanner 
          goingBack={values.goingBack} 
          submitEvent={submitEvent} 
          client={props.client}
      />
  }

  return (
    <div style={{backgroundColor: "#02C39A", height: '100vh'}}>
      <div style={{height: 60}}></div>
      <div className={classNames(classes.main, classes.mainRaised)} style={{height: '90vh'}}>
        <div className={classes.container}>
          <IconButton style={{position: 'absolute', left: 0}} onClick={handleGoBack}>
            <ChevronLeftIcon style={{fontSize: '2em'}} />
          </IconButton>
          <h2 style={{textAlign: 'center'}}><strong>{appBarTitle}</strong></h2>
          <hr />
          { page }
        </div>
      </div>
      <div style={{height: '2em'}}></div>
    </div>
  );
}
