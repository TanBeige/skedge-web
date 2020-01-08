import React from 'react'
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Instagram } from 'react-content-loader'



export default function LoadCardList() {
    return (
        <GridContainer justify='center' style={{marginTop: 20, textAlign: 'center'}}>
          <GridItem xs={6} md={3} xl={3}>
            <Instagram />
          </GridItem>
        </GridContainer>
      )
}