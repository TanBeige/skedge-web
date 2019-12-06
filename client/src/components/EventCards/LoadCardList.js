import React from 'react'
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Instagram } from 'react-content-loader'



export default function LoadCardList() {
    return (
        <GridContainer  style={{marginTop: 20}}>
          <GridItem xs={12} md={6} xl={6}>
            <Instagram />
          </GridItem>
          {/* <GridItem xs={12} md={6} xl={6}>
            <Instagram />
          </GridItem>
          <GridItem xs={12} md={6} xl={6}>
            <Instagram />
          </GridItem>
          <GridItem xs={12} md={6} xl={6}>
            <Instagram />
          </GridItem> */}
        </GridContainer>
        // <div style={{textAlign: 'center', margin: 20}} >
        //   <CircularProgress color="primary" />
        // </div>
      )
}