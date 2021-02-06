import React from 'react'
import './CreatorConnect.css';

/*This class is used to fetch the users from the allRandUsers endpoint and throw back card elements*/
class UsersArray extends React.Component {
  
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  //connects to the endpoint and parses its response to then set this.state's data value to the response.
  componentDidMount() {
    fetch('http://localhost:5000/allRandUsers')
    .then(results => results.json())
    .then(response => {
      this.setState({data: response.data})
    })
  }

  //runs a sudo for loop to iterate through the list of users it was given
  render() {
    //userCount that will be used in the implementation of the search function.
    const userCount = this.state.data.map((user) => console.log("")).length;
    window.count=userCount
    return(
      this.state.data.map((user, i) => {
        return(
        <div className="card firstUsers" id={"searchUsers" + i} key={i}>
              <h1>{user.name}</h1>
              <p >{user.email}</p>
              <p >skills </p>
              <ul >
              {
                user.skills.map((skill, j) => {
                  return(<li key={j}><p>{skill}</p></li>)
                })
              }
            </ul>
        </div>
        )
      })  
    )
  }
}
export default UsersArray
