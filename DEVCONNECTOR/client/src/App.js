import React, { Fragment } from "react"; //Responsible for allow-us to use  the Fragment Component, that is used for call other components inside it
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //Allow us to use the routes components and methods such as Swtich and Route
import Navbar from "./components/layout/Navbar"; //Component that will be call in our aplication
import Landing from "./components/layout/Landing"; //Component that will be call in our aplication
import Register from "./components/auth/Register"; //Component that will be call in our aplication
import Login from "./components/auth/Login"; //Component that will be call in our aplication
import "./App.css";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
