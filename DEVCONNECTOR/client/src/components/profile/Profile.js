import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import { getProfileById } from "../../actions/profile";
import Moment from "react-moment";

/**
 * Profile will be used to show the developer profile when we click in view profile in developer's list
 * here we're bringing other components such as ProfileTop and ProfileAbout, these receive the profile state as parameter
 * and then they put the values in our HTML.
 *
 * getProfileById make a request to api/profile/:id and pass the values to profile.
 *
 * match is used to get the url id, this way we can user getProfileById
 */
const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAutheticated &&
            loading === false &&
            auth.user._id === profile.user_id && (
              <Link to="/edit-profile" className="btn btn-dark p-2">
                Edit Profile
              </Link>
            )}
          <div class="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => {
                    {
                      /**
                        It has a problem when calling a component through a map, so I'm 
                        returning the whole html through each execution of map
                    */
                    }
                    return (
                      <div className="mt-2">
                        <h3 className="text-dark">{experience.company}</h3>
                        <p>
                          <Moment format="YYYY/MM/DD">{experience.from}</Moment>{" "}
                          -{" "}
                          {!experience.to ? (
                            " Now"
                          ) : (
                            <Moment format="YYYY/MM/DD">{experience.to}</Moment>
                          )}
                        </p>
                        <p>
                          <strong>Position: </strong> {experience.title}
                        </p>
                        <p>
                          <strong>Description: </strong>{" "}
                          {experience.description}
                        </p>
                      </div>
                    );
                  })}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education) => {
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />;
                  })}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
