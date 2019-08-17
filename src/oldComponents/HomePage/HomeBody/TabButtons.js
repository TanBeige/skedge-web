import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';


require('./TabButtons.scss')

class TabButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localSelect: true,
            privateSelected: false
        };
    }

    localSelected = (e) => {
        this.setState({localSelect: true});
        this.setState({privateSelect: false});
        this.props.onChange("Local");
    }
    privateSelected = (e) => {
        this.setState({privateSelect: true});
        this.setState({localSelect: false});
        this.props.onChange("Private");
    }

    render() { 
        let btn_local = this.state.localSelect ? 'tabButtons selectedButton active' : 'tabButtons unselectedButton'
        let btn_private = this.state.privateSelect ? 'tabButtons selectedButton active' : 'tabButtons unselectedButton'

        return ( 
            <div className='tabDiv'>
                <Button 
                    className='tabButtons' size='sm' variant="outline-danger"
                    className={btn_local}
                    onClick={this.localSelected}
                >
                    Local
                </Button>
                <Button 
                    className='tabButtons' size='sm' variant="outline-danger"
                    className={btn_private}
                    onClick={this.privateSelected}
                >Private</Button>
            </div>
         );
    }
    
}
 
export default TabButtons;