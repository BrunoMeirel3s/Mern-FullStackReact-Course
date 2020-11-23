import React, { Fragment } from "react"; //Responsible for allow-us to use  the Fragment Component, that is used for call other components inside it
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //Allow us to use the routes components and methods such as Swtich and Route
import Navbar from "./components/layout/Navbar"; //Component that will be call in our aplication
import Landing from "./components/layout/Landing"; //Component that will be call in our aplication
import Register from "./components/auth/Register"; //Component that will be call in our aplication
import Login from "./components/auth/Login"; //Component that will be call in our aplication
import Alert from "./components/layout/Alert";
import "./App.css";
//Redux
import { Provider } from "react-redux"; //Provider allow-us to use the store component
import store from "./store"; //Store will be used to cope with all the actions of our project

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
