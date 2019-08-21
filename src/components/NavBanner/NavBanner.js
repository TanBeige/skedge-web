import React, { Component } from 'react';
import { Navbar, NavDropdown, Nav, Form, FormControl, Col, Row } from 'react-bootstrap/';
const logo = "https://archipreneur.com/wp-content/uploads/2017/10/company-logo-placeholder.jpg"

require("./NavBanner.scss")

const styleJSX= {
    height: '2em',
    width: "100%",
}


class NavBanner extends Component {
    constructor(props) {
        super(props);
        
        this.state = { 
            searchSelected: false,
            searchInput: "",

            canViewLogo: true
        }
    }

    updateDimensions =() => {
        let width = window.innerWidth;
        if(width > 800) {
            this.setState({
                canViewLogo: true
            })
        } else {
            this.setState({
                canViewLogo: false
            })
        }
    }

    /**
     * Add event listener
    */
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }


    handleInput = (e) => {
        this.setState({
            searchInput: e.target.value
        })
    }

    onSearchInput = (e) => {
        this.props.handleSearch(this.state.searchInput);
        e.preventDefault();
    }
    
    render() { 
        return ( 
            <>
            <Row>
                <Navbar bg="danger" variant="dark" fixed="top" role="banner">
                    <Nav>   {/* For profile picture dropdown */}
                        <NavDropdown title={
                            <img className="thumbnail-image" 
                            src={logo} 
                            width="45"
                            height="45"
                            alt="filter"
                            />}
                        id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Col style={{paddingLeft: 0}}>
                        <Form inline className='searchForm' onSubmit={this.onSearchInput} >
                            <FormControl style={styleJSX} type="text" placeholder="Search Event" className="mr-sm-2" size='lg' onChange={this.handleInput} />
                        </Form>
                        </Col>
                    </Navbar.Collapse>
                </Navbar>
                </Row>
            </>
         );
    }
}
 
export default NavBanner;