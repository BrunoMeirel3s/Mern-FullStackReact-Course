import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom"; //allow-us to use the link component to create the redirections to other pages
import { connect } from "react-redux"; //Used to connect the action with the component
import PropTypes from "prop-types";
import { login } from "../../actions/auth"; //The action responsible for this page interactions

const Login = ({ login, isAuthenticated }) => {
  //const email and password will be used to receive the values inserted in our frontend
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //destructuring of the values above
  const { email, password } = formData;

  /**
   * method onChange will be used to take the input filled in frontend
   * and pass the value to one of the consts above such as email and password
   * e.target.name is input name that has to be equal to some const, e.target.value
   * is the value filled in the input
   */
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * onSubmit will be used to call the action login, that receive email and password
   * as parameters to send to the backend and make the login process happen
   */
  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

/**
 * Login.propTypes receive all the actions that we're connecting with
 * this component such as login and the isAthenticated verify
 */
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

/**
 * mapStateToProps is used here to call isAuthenticated from the auth reducer
 * this way we can validate if the user is currently logged in
 */
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
