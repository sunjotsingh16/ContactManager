import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alerts from "./components/layout/Alerts";
import ContactState from "./context/contact/ContactState";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/privateRoutes/PrivateRoute";


if (localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
  <AuthState>
  <ContactState>
    <AlertState>
    <Router>
    <Fragment>
      <Navbar />
      <div className="container">
        <Alerts />
        <Switch>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </div>
    </Fragment>
    </Router>
    </AlertState>
  </ContactState>
  </AuthState>
  );
}

export default App;
