import React, { Fragment } from "react";
import { Link } from "react-router-dom"; //Component responsible for allow-us to call the link method the tag 'a' of HTML
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  //authLinks will be called when the user is logged in
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <i className="fas fa-user" />
        <Link to="/dashboard">
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} to="!#">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  //guestLinks will be called when the user is logged out
  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {
        //we're testing if loading is false if it is we call the fragment that will test if isAuthenticated is true and call the component
        !loading && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )
      }
    </nav>
  );
};

/**
 * Register.propTypes receive all the actions that we're connecting with
 * this component such as logout and auth
 */
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

/**
 * The mapStateToProps bellow is taking all the state from auth
 * then we can make the actions according to these states
 */
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(Navbar);
