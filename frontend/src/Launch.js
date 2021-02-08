import React, { useState } from 'react'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import './CreatorConnect.css';
//*This is the Login Component that will prompt users to either sign up or login to CreatorConnect*/

//NOTE- YOUR HTML CODE NEEDS TO BE AT WRAPPED AROUND A DIV OBJECT.
const STYLE = {
  SPAN:
  {
    fontSize: "1.5em"
  },
  BETA:
  {
    fontSize: ".25em"
  }
}
const skillsOptions = [
  { value: 'App Development', label: 'App Development' },
  { value: 'Electrical Circuits', label: 'Electrical Circuits' },
  { value: 'Laser Cutting', label: 'Laser Cutting' },
  { value: 'Computer Programming', label: 'Computer Programming' },
  { value: '3D Design', label: '3D Design' },
  { value: 'Brand Development', label: 'Brand Development' },
  { value: 'Design Thinking', label: 'Design Thinking' },
  { value: 'Digital Fabrication/3D Printing', label: 'Digital Fabrication/3D Printing' },
  { value: 'Social Entrepreneurship', label: 'Social Entrepreneurship' },
  { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  { value: 'Game/VR Design', label: 'Game/VR Design' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'Digital Photography', label: 'Digital Photography' },
  { value: 'User Experience (UX) Design', label: 'User Experience (UX) Design' },
  { value: 'Social Media Marketing', label: 'Social Media Marketing' },
  { value: 'Video Production', label: 'Video Production' },
  { value: 'Web Design', label: 'Web Design' },
  { value: 'Web Development', label: 'Web Development' },
]

const gradOptions = [
  {value: '2021', label: '2021'},
  {value: '2022', label: '2022'},
  {value: '2023', label: '2023'},
  {value: '2024', label: '2024'},

]

/*This function will be used to handle the form*/
export default function MultipleSelect() {
  const existingUser = "Existing User? Click here"
  const newUser = "New User? Click Here"
  //react hooks are used in a rather unconventional manner here. Allows for uniform asynchrenous functionality later on
  const boolArray = [true, false]  
  const [registration, hideRegistration] = useState(boolArray[0]);
  const [login, setLogin] = useState(boolArray[1]);
  const [button, setButton] = useState(existingUser);
  const [isLoggedOut, checkLogin] = useState(-1)//useState(boolArray[1]);
  const [skills, updateSkills] = useState("")

  const axios = require('axios');
  const axiosWithCookies = axios.create({
    withCredentials: true
  });
  
/*Trigger buttons that use hooks to either show or hide the login/signup option*/
  function triggerRegistration() {hideRegistration(!registration)}
  function triggerLogin() {setLogin(!login)}
  function triggerButton() {if(button === existingUser){setButton(newUser)}else{setButton(existingUser)}}
  


  window.onload = function () {
    axiosWithCookies.get(`http://localhost:5000/login`)
    .then((response) => {
      if(parseInt(JSON.stringify(response.data)) === 0)
      {
        checkLogin(
          isLoggedOut + 1
        )
      }
      })
  }
  

  return isLoggedOut === 0 ? (
    <div>
      {window.location.assign('http://localhost:3000/cards')}
    </div>
  )
  :
  (
    //TO DO: ADD HOVERS
    <div className="contentWrapper">
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
      <div className ="bothDivs">
        <div className = "leftDiv">
          <img img src="/images/logo.png" alt="hub logo" className = "hubLogo"></img>
        </div>
        <div className = "rightDiv">
          <div className = "signUpOrIn">
            <div className = "CreatorConnectLogo">
            <h4 className="launchText"><span style={STYLE.SPAN}>C</span>reator<span style={STYLE.SPAN}>C</span>onnect<span style={STYLE.BETA}>BETA</span></h4>

              <div className="wrapper">
              <div className = "information">

              {/*first form, the new user form*/}
              {registration && <form action = 'http://localhost:5000/register' method = 'POST'>
                  <input required className="inputBox" type="text" name="firstName" placeholder="First Name" ></input>
                  <br></br>
                  <input required className="inputBox" type="text" name="lastName" placeholder="Last Name" ></input>
                    <br></br> 
                  <input required className="inputBox" type="email" name="fsuEmail" placeholder="FSU E-mail (lowercase)" pattern=".+@.+.fsu.edu"></input>
                  <br></br>
                  <input required className="inputBox" type="password" name="password" placeholder="Password" ></input>
                
                  {/*VERIFY PASSWORD INPUT BOX... WILL BE LEFT OUT FOR BETA AND FOCUS GROUP RELEASE*/}
                  
                <div className="dropdown">
                  <Select 
                    isMulti options={skillsOptions} 
                    placeholder="Select Skills..."
                    onChange={onChange()} />
                  </div>

                <div className="dropdown"><Select options={gradOptions} isSearchable={false} placeholder="Graduation Year" /></div>

                
                  {/*FORCE LOWERCASE INPUT GOING FORWARD*/}
               
                <button className="inputBox" type="submit">Submit!</button>
                </form>}

                {/*second form, the existing user form*/}
                {login && <form action = 'http://localhost:5000/login' method = 'POST'>
                    <input required className="inputBox" type="text" name="fsuEmail" placeholder="FSU E-mail"></input>
                  <input required className="inputBox" type="password" name="password" placeholder="Password"></input>
                  <button className="inputBox" type="submit">Log In</button>
                </form>} 
                
                {/*button that triggers between the new user and the existing user forms*/}
                <button className="inputBox" onClick={() => {
                  triggerRegistration();
                  triggerLogin();
                  triggerButton();
                }}>
                  {button}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

//testing deploy