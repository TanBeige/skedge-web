import React from 'react'




export default function SaveDealButton ({client, dealId, userId}) {

    const clickedSave = () => {
        console.log("Ass");
    }
    return (
        // <div style={{position: 'absolute', right: 0, top: 0}}>
        <Fragment>
            <IconButton aria-label="save" onClick={clickedSave}>
                <StarIcon color={'secondary'} fontSize='large'/>
            </IconButton> 
        </Fragment>
        // </div>
    )
}