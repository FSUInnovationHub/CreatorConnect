import React from 'react'
import UsersArray from './UsersArray';
import './CreatorConnect.css';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button  } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';




/*This is the Home component that will hold the logo and the search bar*/

//NOTE- YOUR HTML CODE NEEDS TO BE AT WRAPPED AROUND A DIV OBJECT.

const STYLE = {
  SPAN:
  {
    fontSize: "1.5em"
  },
  BETA:
  {
    fontSize: ".25em"
  },
  EMPH:
  {
    fontSize: "1.2em"
  },
  SLI:
  {
    fontSize: "1.4em"
  }
}

class NavigationBar extends React.Component {
  constructor() {
    /*keyUpHandler in the search bar is binded so that serch results are fed as they come up in real time
    the openModal features are a part of react's modal class used for "pop up boxes"*/
    super();
    this.state = {};
  }
  render() {
    return (
  
      
      <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">CreatorConnect</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#link">Projects</Nav.Link>
      <Nav.Link href="#link">Edit Account</Nav.Link>
      <Nav.Link href="https://docs.google.com/forms/d/e/1FAIpQLSfMOPEx9jRyK6V4fIn_O-uS4YphSi8HBa50LRRKVQhD6niNhg/viewform" target="_blank">Feedback</Nav.Link>
      <Nav.Link href="http://localhost:5000/logout" style={{float: 'right'}}>Log Out</Nav.Link>
      
    </Nav>
   
  </Navbar.Collapse>
</Navbar>)
     
  
}
}
export default NavigationBar
