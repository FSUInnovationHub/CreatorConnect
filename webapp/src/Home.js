import React from 'react'
import UsersArray from './UsersArray';
import './CreatorConnect.css';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';


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

class Home extends React.Component {
  constructor() {
    /*keyUpHandler in the search bar is binded so that serch results are fed as they come up in real time
    the openModal features are a part of react's modal class used for "pop up boxes"*/
    super();
    this.handleSearch = this.keyUpHandler.bind(this, 'search')
    this.state = {
      data: 0,
      totalUsers: 0,
      modalIsOpen: false,
      sptModalIsOpen: false,
      ftrModalIsOpen: false,
      teamModalIsOpen: false,
      editModalIsOpen: false,
      userName: "",
      userEmail: "",
      userGrad: NaN,
      userSkills: [],
      checked: false,

    };
    this.handleChange = this.handleChange.bind(this);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.sptOpenModal = this.sptOpenModal.bind(this);
    this.sptAfterOpenModal = this.sptAfterOpenModal.bind(this);
    this.sptCloseModal = this.sptCloseModal.bind(this);

    this.ftrOpenModal = this.ftrOpenModal.bind(this);
    this.ftrAfterOpenModal = this.ftrAfterOpenModal.bind(this);
    this.ftrCloseModal = this.ftrCloseModal.bind(this);

    this.teamOpenModal = this.teamOpenModal.bind(this);
    this.teamAfterOpenModal = this.teamAfterOpenModal.bind(this);
    this.teamCloseModal = this.teamCloseModal.bind(this);

    this.editOpenModal = this.editOpenModal.bind(this);
    this.editAfterOpenModal = this.editAfterOpenModal.bind(this);
    this.editCloseModal = this.editCloseModal.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  componentDidMount() {
    
    const axios = require('axios');
    const axiosWithCookies = axios.create({
      withCredentials: true
    });
    //connects to the login endpoint and reads the session cookie to see if the user is logged in to gain access to the cards page
    axiosWithCookies.get(`https://orlandokenny.pythonanywhere.com/login`)
        .then((response) => {
            this.setState({
                data: parseInt(JSON.stringify(response.data))
            });
        }).catch((error) => {
            alert("There was an error connecting to the api")
            console.error(error);
        });
    //connects to the usercount endpoint to get the user count displayed in the 
    axios.get(`https://orlandokenny.pythonanywhere.com/userCount`)
        .then((response) => {
            this.setState({
                totalUsers: parseInt(JSON.stringify(response.data.data))
            });
        }).catch((error) => {
            console.error(error);
        });

    
        //connects to the login endpoint and reads the session cookie to see if the user is logged in to gain access to the cards page
    axiosWithCookies.get(`https://orlandokenny.pythonanywhere.com/changeInfo`)
    .then((response) => {
      this.setState({
        userName: response.data.data.name,
        userEmail: response.data.data.email,
        userGrad: response.data.data.gradYear,
        userSkills: response.data.data.skills
      })
    }).catch((error) => {
        
        console.error(error);
    });
  }

  //handles the real time serach bar and hides cards that do not correspond to the search query
  keyUpHandler(refName, e) {
    var input, filter;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    var searchResults = []
    var userText = []
    for(var i = 0; i < window.count; i++)
    {
      var div = document.getElementById("searchUsers" + i);
      userText.push(div.innerText)
    }
    for(i = 0; i < window.count; i++)
        {
          searchResults = []
          if (userText[i].toUpperCase().indexOf(filter) > -1)
          {
            div = document.getElementById("searchUsers" + i)
            searchResults.push(div)
            div.style.display = ""
          }
          else
          {
            div = document.getElementById("searchUsers" + i);
            div.style.display = "none";
          }
        }
  }

  filterBy(argument) {
    var input, filter;
    if(argument === "ALL")
    {
      input = [""]

    }
    else if(argument === "DESIGN")
    {
      input = ["DESIGN"]
    }
    else if(argument === "CREATE")
    {
      input = ["DIGITAL PHOTOGRAPHY", "VIDEO PRODUCTION", "ENTREPRENEURSHIP", "SOCIAL ENTREPRENEURSHIP", "SOCIAL MEDIA MARKETING"]
    }
    else if(argument === "BUILD")
    {
      input = ["LASER CUTTING", "ELECTRICAL CIRCUITS", "3D PRINTING"]
    }
    else if(argument === "DEVELOP")
    {
      input = ["DEVELOPMENT", "COMPUTER PROGRAMMING"]
    }
    else
    {
      input = [""]
    }
    filter = [];
    for(var i = 0; i < input.length; i++)
    {
      filter.push(input[i])
    }
    var searchResults = []
    var userText = []
    for(i = 0; i < window.count; i++)
    {
      var div = document.getElementById("searchUsers" + i);
      userText.push(div.innerText)
    }
    for(i = 0; i < window.count; i++)
    {
      searchResults = []
      for(var j = 0; j < filter.length; j++)
      {
        if (userText[i].toUpperCase().indexOf(filter[j]) > -1)
        {
          div = document.getElementById("searchUsers" + i)
          searchResults.push(div)
        }
        else
        {
          div = document.getElementById("searchUsers" + i);
          div.style.display = "none";
        }
      }
      for(j = 0; j < searchResults.length; j++)
      {
        div.style.display = ""
      }

    }

  }

  //the following four sets of openModal and closeModal all set the modalIsOpen state to either be true or false
  //this state is then used to determine if to open the modal or close the modal
  //this is done by the modal class. NOTE- The afterOpenModal function can be used to activate an animation
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {}

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  sptOpenModal() {
    this.setState({sptModalIsOpen: true});
  }

  sptAfterOpenModal() {}

  sptCloseModal() {

    this.setState({sptModalIsOpen: false});
  }

  ftrOpenModal() {
    this.setState({ftrModalIsOpen: true});
  }

  ftrAfterOpenModal() {}

  ftrCloseModal() {
    this.setState({ftrModalIsOpen: false});
  }

  teamOpenModal() {
    this.setState({teamModalIsOpen: true});
  }

  teamAfterOpenModal() {}

  teamCloseModal() {
    this.setState({teamModalIsOpen: false});
  }

  editOpenModal() {
    this.setState({editModalIsOpen: true});

  }

  editAfterOpenModal() {
    
  }

  editCloseModal() {
    this.setState({editModalIsOpen: false});
  }

  /*This class is internally conditionally rendered based on the code given by the login endpoint.
    The implementation is nested in a set of True or False conditionals.
    i.e. if data = 0 render 0, if not render 1... if data is 1 render 1, if not render 2.
    Through this process we are implicitly creating the equivalent to an if statement with AND and OR
    the reason for this is simplicity and visibility since we are returning html components.

    RESPONSES FROM /login ENDPOINT
      0 = logged in 
      1 = User with email entered already exists
      2 = Wrong Password
      3 = User with that email does not exist
      5 = logged out
      any other int = an unkown internal server error*/

      /* 
      render() {
        return this.state.data === 0 ? 
        (
          html
        )
        :
        (
          other html 
        )
      }


      */
  render() {
    return this.state.data === 0 ?
    (
      <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
      <div class="topnav">
        <form className="formWrap" action='https://orlandokenny.pythonanywhere.com/logout' method = 'POST' >
          <button className = "logout" type="submit">Logout</button>
        </form>
          
        <button className="leftNavBar" onClick={this.openModal}>&nbsp;ABOUT </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal">
          <div className="modalBtn">
            <button onClick={this.closeModal}>close</button>
          </div>
          <h1 className="modalLogo"><span style={STYLE.SPAN}>C</span>reator<span style={STYLE.SPAN}>C</span>onnect<span style={STYLE.BETA}>BETA</span></h1>
          <div className="modalText">
            <p>
              <span style={STYLE.SLI}>C</span><span style={STYLE.EMPH}>reator</span><span style={STYLE.SLI}>C</span><span style={STYLE.EMPH}>onnect</span>’s primary goal is to bridge the gap between skilled students and those who need assistance with developing their independent projects! <br></br>
              <span style={STYLE.SLI}>R</span>ally with us here at The Innovation Hub as we encourage the expression of creativity and critical thinking! <br></br>
              <span style={STYLE.SLI}>E</span><span style={STYLE.EMPH}>mpathize, Ideate, and Build</span> no matter what field you're in!<br></br>
              <span style={STYLE.SLI}>A</span>dvance your skillset and expertise with our network of other Creators!<br></br>
              <span style={STYLE.SLI}>T</span>ogether we'll network like never before!<br></br>
              <span style={STYLE.SLI}>E</span>nroll in <span style={STYLE.EMPH}>C</span>reator<span style={STYLE.EMPH}>C</span>onnect today!
            </p>
          </div>
        </Modal>

        <button className="leftNavBar" onClick={this.teamOpenModal}>&nbsp;TEAM </button>
        <Modal
          isOpen={this.state.teamModalIsOpen}
          onAfterOpen={this.teamAfterOpenModal}
          onRequestClose={this.teamCloseModal}
          contentLabel="Example Modal">
          <div className="modalBtn">
            <button onClick={this.teamCloseModal}>close</button>
          </div>

          <h1 className="modalLogo"><span style={STYLE.EMPH}>M</span>eet&nbsp;&nbsp;the<span style={STYLE.EMPH}>&nbsp;&nbsp;T</span>eam</h1>
          <div className="teamBlurbContainer">
            <img img src="/images/teamImage.png" className="teamPics" alt="team"></img>
          </div>
        </Modal>

        <button className = "leftNavBar" onClick={this.editOpenModal} type="submit">edit</button>
          <Modal
          isOpen={this.state.editModalIsOpen}
          onAfterOpen={this.editAfterOpenModal}
          onRequestClose={this.editCloseModal}
          contentLabel="Example Modal">
          <div className="modalBtn">
            <button onClick={this.editCloseModal}>close</button>
            <button className="float"onClick={() => {
              var result = window.confirm("Are you sure you want to delete your account?")
              if(result === true)
              {
                window.location = "https://orlandokenny.pythonanywhere.com/delete"
              }
              else
              {

              }
          }}>delete account</button>
          <div className="editModal">
          <div className = "signUpOrIn2">
            <div className = "CreatorConnectLogo">
            <h4 className="launchText"><span style={STYLE.SPAN}>C</span>reator<span style={STYLE.SPAN}>C</span>onnect<span style={STYLE.BETA}>BETA</span></h4>

             
              <div className = "information">
          <form action = 'https://orlandokenny.pythonanywhere.com/changeInfo' method = 'POST'>
                  <input required className="inputBox" type="text" name="firstName" placeholder="First Name" defaultValue={(this.state.userName.split(" "))[0]} ></input>
                
                  <input required className="inputBox" type="text" name="lastName" placehodler="Last Name" defaultValue={(this.state.userName.split(" "))[1]} ></input>
                
                  <input required className="inputBox" type="email" name="fsuEmail" placeholder="FSU Email" defaultValue={(this.state.userEmail)} pattern=".+@.+.fsu.edu"  ></input>

                
                  {/*VERIFY PASSWORD INPUT BOX... WILL BE LEFT OUT FOR BETA AND FOCUS GROUP RELEASE*/}
                
                <div className="dropdown">
                  <select name="gradYear" class="ui fluid dropdown">
                      <option value={this.state.userGrad}>Graduation Year: {this.state.userGrad}</option>
                      <option value="2020">2020</option>
                      <option value="2021">2021</option>
                      <option value="2022" >2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                  </select>
                </div>

                  {/*FORCE LOWERCASE INPUT GOING FORWARD*/}
                  <div className="dropdown">
                    <select name="firstSkill" class="ui fluid dropdown">
                      <option value={this.state.userSkills[0]}>Skill #1: {this.state.userSkills[0]}</option>
                      <option value="App Development">App Development</option>
                      <option value="Electrical Circuits">Electrical Circuits</option>
                      <option value="Laser Cutting">Laser Cutting</option>
                      <option value="Computer Programming">Computer Programming</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Brand Development">Brand Development</option>
                      <option value="Design Thinking">Design Thinking</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Social Entrepreneurship">Social Entrepreneurship</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Game/VR Design">Game/VR Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Photography">Digital Photography</option>
                      <option value="User Experience (UX) Design">User Experience (UX) Design</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                </div>

                <div className="dropdown">
                    <select name="secondSkill" class="ui fluid dropdown">
                      <option value={this.state.userSkills[1]}>Skill #2: {this.state.userSkills[1]}</option>
                      <option value="App Development">App Development</option>
                      <option value="Electrical Circuits">Electrical Circuits</option>
                      <option value="Laser Cutting">Laser Cutting</option>
                      <option value="Computer Programming">Computer Programming</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Brand Development">Brand Development</option>
                      <option value="Design Thinking">Design Thinking</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Social Entrepreneurship">Social Entrepreneurship</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Game/VR Design">Game/VR Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Photography">Digital Photography</option>
                      <option value="User Experience (UX) Design">User Experience (UX) Design</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                </div>

                <div className="dropdown">
                    <select name="thirdSkill" class="ui fluid dropdown">
                      <option value={this.state.userSkills[2]}>Skill #3: {this.state.userSkills[2]}</option>
                      <option value="App Development">App Development</option>
                      <option value="Electrical Circuits">Electrical Circuits</option>
                      <option value="Laser Cutting">Laser Cutting</option>
                      <option value="Computer Programming">Computer Programming</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Brand Development">Brand Development</option>
                      <option value="Design Thinking">Design Thinking</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Social Entrepreneurship">Social Entrepreneurship</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Game/VR Design">Game/VR Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Photography">Digital Photography</option>
                      <option value="User Experience (UX) Design">User Experience (UX) Design</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                </div>

                <div className="dropdown">
                    <select name="fourthSkill" class="ui fluid dropdown">
                      <option value={this.state.userSkills[3]}>Skill #4: {this.state.userSkills[3]}</option>
                      <option value="App Development">App Development</option>
                      <option value="Electrical Circuits">Electrical Circuits</option>
                      <option value="Laser Cutting">Laser Cutting</option>
                      <option value="Computer Programming">Computer Programming</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Brand Development">Brand Development</option>
                      <option value="Design Thinking">Design Thinking</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Social Entrepreneurship">Social Entrepreneurship</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Game/VR Design">Game/VR Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Photography">Digital Photography</option>
                      <option value="User Experience (UX) Design">User Experience (UX) Design</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                </div>

                <div className="dropdown">
                    <select name="fifthSkill" class="ui fluid dropdown">
                      <option value={this.state.userSkills[4]}>Skill #5: {this.state.userSkills[4]}</option>
                      <option value="App Development">App Development</option>
                      <option value="Electrical Circuits">Electrical Circuits</option>
                      <option value="Laser Cutting">Laser Cutting</option>
                      <option value="Computer Programming">Computer Programming</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Brand Development">Brand Development</option>
                      <option value="Design Thinking">Design Thinking</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Social Entrepreneurship">Social Entrepreneurship</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Game/VR Design">Game/VR Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Photography">Digital Photography</option>
                      <option value="User Experience (UX) Design">User Experience (UX) Design</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                </div>
                  <button className="inputBox2" type="submit">Submit</button>
                </form>
                </div>
                </div>
                </div>
                </div>
        
          </div>
          </Modal>

        

        <a href="https://forms.gle/j19asMDP9VCjtQMDA"><button className="leftNavBar">FEEDBACK</button></a>
      </div>

        <h2 className="textAboveSearch"><span style={STYLE.SPAN}>C</span>reator<span style={STYLE.SPAN}>C</span>onnect<span style={STYLE.BETA}>BETA</span></h2>
        
        <div class="parent">
          <div class="searchBar"><input id="myInput" type="text" onKeyUp={this.handleSearch} placeholder={"Search through " + this.state.totalUsers + " users and their skills..."} ref="search"></input></div>
          <div id="btnContainer">
          <div className="tooltip">
            <div className="filterBtn"><button onClick={() => this.filterBy("ALL")}>ALL</button></div>
            <span class="tooltiptext">CLICK TO SHOW ALL USERS</span>
          </div>

          
          <div className="tooltip">
          <div className="filterBtn"><button onClick={() => this.filterBy("DESIGN")}>DESIGN</button></div>
            <span class="tooltiptext">CLICK TO FILTER BY: <br></br><br></br>GRAPHIC DESIGN<br></br>GAME/VR DESIGN<br></br>WEB DESIGN<br></br>3D DESIGN <br></br>UX DESIGN<br></br>DESIGN THINKING</span>
          </div>
          

          <div className="tooltip">
            <div className="filterBtn"><button onClick={() => this.filterBy("CREATE")}>CREATE</button></div>
            <span class="tooltiptext">CLICK TO FILTER BY: <br></br><br></br>DIGITAL PHOTOGRAPHY<br></br>VIDEO PRODUCTION<br></br>ENTREPRENEURSHIP<br></br>SOCIAL ENTREPRENEURSHIP <br></br>SOCIAL MEDIA MARKETING</span>
          </div>

          <div className="tooltip">
            <div className="filterBtn"><button onClick={() => this.filterBy("DEVELOP")}>DEVELOP</button></div>
            <span class="tooltiptext">CLICK TO FILTER BY: <br></br><br></br>BRAND DEVELOPMENT<br></br>COMPUTER PROGRAMMING<br></br>APP DEVELOPMENT<br></br>WEB DEVELOPMENT </span>
          </div>

          <div className="tooltip">
            <div className="filterBtn"><button onClick={() => this.filterBy("BUILD")}>BUILD</button></div>
            <span class="tooltiptext">CLICK TO FILTER BY: <br></br><br></br>ELECTRICAL CIRCUITS<br></br>LASER CUTTING<br></br>3D PRINTING  </span>
          </div>
          
          </div>
          
        </div>
        <div class="cards-container" id = "users">
      <UsersArray></UsersArray>
      </div>
      {/* DO NOT REMOVE THIS DIV COMPONENT*/}</div>
    )
    :
    (
      this.state.data === 5 ?
      (
        <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
        {
          alert("You must be logged in in order to access this page. You will now be redirected to the home page")
        }
        <Redirect to={{pathname: "/",}}/>
      </div>
      )
      :
      (
        this.state.data === 2 ?
        (
          <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
          {
            alert("The password you entered was incorrect. You will now be redirected to the launch page.")
          }
          <Redirect to={{pathname: "/",}}/>
        </div>
        )
        :
        (
          this.state.data === 3 ?
          (
            <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
            {
              alert("We couldn't find a user with the email you entered. You will now be redirected to the launch page.")
            }
            <Redirect to={{pathname: "/",}}/>
          </div>
          )
          :
          (
            this.state.data === 1 ?
            (
              <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
              {
                alert("A user with that email already exists. You will now be redirected to the launch page.")
              }
              <Redirect to={{pathname: "/",}}/>
            </div>
            )
            :
            (
                <div> {/* DO NOT REMOVE THIS DIV COMPONENT*/}
                {
                alert("An unkown error occured. Please contact support. You will now be redirected to the launch page.")
                }
                <Redirect to={{pathname: "/",}}/>
                </div>
            )
          )
        )
      )
    )
  }
}
export default Home
