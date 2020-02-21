import React, {useState} from "react";
// @material-ui/core components
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from "components/CustomButtons/Button.js";
import EventActivity from 'views/EventPage/Sections/EventPageComponents/EventActivity.js';
import SkedgeDisclosure from "components/Footer/SkedgeDisclosure.js";
import CategoryFragment from './CategoryFragment.js';

//import Quote from "components/Typography/Quote.js";
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

require('./InfoItems.css');

export default function PageDescription({description, web_url, category, point_1, point_2, pageType}) {
    const [expandDetails, setExpandDetails] = useState(false)

    return(
        <div className='ItemDescription'>
            <Paper  elevation={0} square>
                <Collapse in={expandDetails} collapsedHeight='3em' timeout="auto">
                <div style={{margin: '0px 0.5em'}}>
                    
                    <p className={expandDetails ?  "NotFadingOut": "FadingOut"} style={{wordWrap: 'break-word', whiteSpace: "pre-line"}}>
                    <b>Details: </b>
                        {description}
                    </p>
                    {point_1 ? <p>- {point_1}</p> : ""}
                    {point_2 ? <p>- {point_2}</p> : ""}

                    {
                        category || web_url ?
                        <div style={{display:'inline-flex', width: '100%'}}>
                            {
                                web_url && web_url !== "" ?
                                <div><a href={ web_url.includes("https://") || web_url.includes("http://") ? web_url : `//${web_url}`} target='_blank'><Button color='primary'  size='sm'>Link to {pageType === "events" ? "tickets" : "deal"}</Button></a></div> : ""
                            }
                            <div style={{margin: '0.5em', width: '100%', textAlign: 'right'}}>
                                {
                                    category ? <CategoryFragment category={category} /> : ""
                                }
                            </div>
                        </div> : ""
                    }
                </div>
                <div style={{margin: '0px 10px 0px 10px'}}>
                    <SkedgeDisclosure/>
                </div>
                </Collapse> 
                <div style={{width: '100%', textAlign: 'center'}}>
                <IconButton style={{width: '100%', borderRadius: 4, padding: 0}} disableRipple onClick={()=>setExpandDetails(!expandDetails)}>
                    {expandDetails ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                </IconButton>
                </div>
            </Paper>
        </div>
    )
}