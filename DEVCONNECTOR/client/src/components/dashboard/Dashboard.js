import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner"; //Component used to display a loading gif
import DashboardActions from "./DashboardActions";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  /**
   * useEffect is used to call the getCurrentProfile as soon as the
   * Dashboard component be loaded, this way we do a request to 'api/profile/me'
   * an it receives the actual user.id and send back to us the current user profile
   */
  useEffect(() => {
    getCurrentProfile();
  }, []);
  /**
   * Return will check if loading and profile states are stil null
   * then it will display the loading component, the "Spinner",
   * after profile or loading change it states we're going to
   * display the Fragment that contains the user information or the create
   * profile link
   */
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user">Welcome {user && user.name}</i>
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

/**
 * Dashboard.propTypes receive all the actions that we're connecting with
 * this component such as getCurrentProfile, auth and profile
 */
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

/**
 * mapStateToProps is used here to call auth states and profile states
 * this way we can use it's states
 */
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
