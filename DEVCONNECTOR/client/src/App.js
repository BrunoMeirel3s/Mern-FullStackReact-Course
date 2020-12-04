import React, { Fragment, useEffect } from "react"; //Responsible for allow-us to use  the Fragment Component, that is used for call other components inside it
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //Allow us to use the routes components and methods such as Swtich and Route
import Navbar from "./components/layout/Navbar"; //Component that will be call in our aplication
import Landing from "./components/layout/Landing"; //Component that will be call in our aplication
import Register from "./components/auth/Register"; //Component that will be call in our aplication
import Login from "./components/auth/Login"; //Component that will be call in our aplication
import Alert from "./components/layout/Alert";
import DashBoard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-form/CreateProfile";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";
//Redux
import { Provider } from "react-redux"; //Provider allow-us to use the store component
import store from "./store"; //Store will be used to cope with all the actions of our project
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser);
  }, []);
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
              <PrivateRoute exact path="/dashboard" component={DashBoard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
