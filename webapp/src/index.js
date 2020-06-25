import React from 'react';
import ReactDOM from 'react-dom';
import './CreatorConnect.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Home from './Home';
import Launch from './Launch'
import Error from './Error'

//the router below reads the path that the user is on and throws a React component at it depending on the path.
const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={Launch}/>
      <Route  exact path="/cards" component={Home}/>
      <Route exact path="/*" component={Error} />
    </Switch>
  </Router>
)

//the code below reads the path and renders component on a conditional basis. i.e. /home throws two different components at different places...
ReactDOM.render(routing, document.getElementById("root"));
serviceWorker.unregister();
