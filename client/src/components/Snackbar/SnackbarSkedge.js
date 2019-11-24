import React from "react";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Clearfix from "components/Clearfix/Clearfix.js";

export default function Notifications(props) {

    // useEffect(() => {
    //     setOpen(true);
    // }, [status]);

    // function handleClose(event, reason) {
    //     if (reason === "clickaway") {
    //       return;
    //     }
    //     setOpen(false);
    // }

    return (
        <div>
            <SnackbarContent
                message={
                    <span>
                    <b>INFO ALERT:</b> {props.status}
                    </span>
                }
                close
                color="info"
                icon="info_outline"
            />
            <Clearfix />
        </div>
    );
}