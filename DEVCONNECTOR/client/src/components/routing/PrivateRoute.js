/**
 * PrivateRoute is going to be used to verify if the user is authenticated
 * and if loading is false, this way we will display the component that is
 * protected with PrivateRoute
 */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/**
 * PrivateRoute receives a component as a parameter and
 * the auth states, this way we can verify if the user is authenticated or not
 */
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    //..rest means that we're passing the props to render
    {...rest}
    /**
     * render is responsible to display the component passed as a parameter
     * to PrivateRoute or redirect the user to '/login' if he's not logged in
     */
    render={(props) =>
      !isAuthenticated ? <Redirect to="/login" /> : <Component {...props} />
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PrivateRoute);
