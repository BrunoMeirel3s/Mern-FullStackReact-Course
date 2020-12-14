import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";

/**
 * Profiles will be used to show all the profiles saved in our database,
 * getProfiles is the action that make a request to '/api/profiles' and change the state profiles and loading
 * this way profiles receives an array that contains all the profiles, pay attention that we're destructuring
 * profiles and loading from profile that is our reducer
 */
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  //useEffect is used to call getProfiles as soon as the component Profile is loaded
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i>Browse and connect with
            developers
          </p>

          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4> No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

/**
 * Profiles.propTypes is necessary to call the props that are going to be used in Profile component
 */
Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

/**
 * mapStateToProps is used to call the states present in profile, this way we can destructed profile and
 * get only what we're going to use
 */
const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
