import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
require('./TabButtons.css')

class TabButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localSelect: true,
            friendSelected: false
        };
    }

    localSelected = (e) => {
        this.setState({localSelect: true});
        this.setState({friendSelect: false});
        this.props.onChange("local");
    }
    friendSelected = (e) => {
        this.setState({friendSelect: true});
        this.setState({localSelect: false});
        this.props.onChange("friends");
    }

    render() { 
        let btn_local = this.state.localSelect ? 'primary' : 'secondary'
        let btn_friend = this.state.friendSelect ? 'primary' : 'secondary'

        return ( 
            <div className='tabDiv'>
                <ButtonGroup className='tabGroup' color='primary' fullWidth disableRipple variant="contained" aria-label="full width button group" >
                        <Button 
                            className='tabButtons' size='large' variant="contained"
                            color={btn_local}
                            onClick={this.localSelected}
                        >
                            Local
                        </Button>
                        <Button 
                            className='tabButtons' size='large' variant="contained"
                            color={btn_friend}
                            onClick={this.friendSelected}
                        >Friends</Button>
                </ButtonGroup>
            </div>
         );
    }
    
}
 
export default TabButtons;