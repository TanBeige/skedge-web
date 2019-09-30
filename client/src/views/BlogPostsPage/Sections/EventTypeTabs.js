import React, { useState } from "react";
import Button from 'components/CustomButtons/Button.js';
import ApartmentIcon from '@material-ui/icons/Apartment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { makeStyles } from "@material-ui/core/styles";


export default function EventTypeTabs(props) {
    let localBtn;
    let exclusiveBtn;
    if (props.active === "local") {
        localBtn = true;
        exclusiveBtn = false;
    }
    else if (props.active === "private") {
        localBtn = false;
        exclusiveBtn = true;
    }
    const handleLocal = (event) => {
        props.onLocal()
    }
    const handleExclusive = (event) => {
        props.onExclusive()
    }
    return(
        <div>
            <Button onClick={handleLocal} simple={localBtn} round><ApartmentIcon/>Local</Button>
            <Button onClick={handleExclusive} simple={exclusiveBtn} round><EmojiPeopleIcon/>Exclusive</Button>
        </div>
    )
}