import React from 'react'
import './CreatorConnect.css';
import { Redirect, withRouter } from "react-router-dom";

/*This is the Home component that will hold the logo and the search bar*/

//NOTE- YOUR HTML CODE NEEDS TO BE AT WRAPPED AROUND A DIV OBJECT.

const STYLE = {
  SPAN:
  {
    fontSize: "1.5em"
  },
  NAPS:
  {
    fontSize: ".75em"
  },
}

/*This class is used to render a 404 error when the user tries to access a nonexistent link*/
class Error extends React.Component {
  state = {
    toLaunch: false,
  }
  handleSubmit = () => {
    this.setState({
      toLaunch: true,
    });
  }

  render()
  { 
    if(this.state.toLaunch === true)
    {
      return <Redirect to="/" />
    }

    
    return (
      <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
        <div className = "fourohfour">
          <h2 className="textAboveSearch"><span style={STYLE.SPAN}>404</span> Error</h2>
          <h2><span style={STYLE.NAPS}>We couldn't find that page!</span> </h2>
            <h3 className="homeText" onClick={this.handleSubmit}>home</h3>
        </div>
      {/* DO NOT REMOVE THIS DIV COMPONENT*/}</div>
      )
  }
}
export default withRouter (Error)
