import axios from "axios";
import { setAlert } from "./alert";

import {
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  GET_REPOS,
} from "./types";

//Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    /**
     * Here we are doing a get request to api/profile/me that
     * send to us the current logged user profile
     */
    const res = await axios.get("/api/profile/me");

    /**
     * dispatch call the GET_PROFILE in our reducers and pass the values received
     * by the request above to the payload, this way we have access in our frontEnd to this
     * values
     */
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    /**
     * If something goes wrong we'll call PROFILE_ERROR passing the error message
     * as payload
     */
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get All profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });

  try {
    /**
     * Here we are doing a get request to api/profile that
     * send to us all users profiles
     */
    const res = await axios.get("/api/profile");

    /**
     * dispatch call the GET_PROFILES in our reducers and pass the values received
     * by the request above to the payload, this way we have access in our frontEnd to this
     * values
     */
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    /**
     * If something goes wrong we'll call PROFILE_ERROR passing the error message
     * as payload
     */
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get profile by ID
export const getProfileById = (userID) => async (dispatch) => {
  try {
    /**
     * Here we are doing a get request to api/profile/userid that
     * send to us a especific user
     */
    const res = await axios.get(`/api/profile/${userID}`);

    /**
     * dispatch call the GET_PROFILES in our reducers and pass the values received
     * by the request above to the payload, this way we have access in our frontEnd to this
     * values
     */
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    /**
     * If something goes wrong we'll call PROFILE_ERROR passing the error message
     * as payload
     */
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    /**
     * Here we are doing a get request to api/profile/github/username that
     * send to us the repositories of the user passed as parameter
     */
    const res = await axios.get(`/api/profile/github/${username}`);

    /**
     * dispatch call the GET_PROFILES in our reducers and pass the values received
     * by the request above to the payload, this way we have access in our frontEnd to this
     * values
     */
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    /**
     * If something goes wrong we'll call PROFILE_ERROR passing the error message
     * as payload
     */
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile
/**
 * Pay attention that we're receiving history and edit as parameters, edit will be passed
 * when the user already has a profile and we just want to update it, history is received as a parameter
 * to redirect the user to '/dashboard after he has created his profile
 */
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    //config shows that we're working with data in json format
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //res receive the return of a request to '/api/profile' passing formData as values
    const res = await axios.post("/api/profile", formData, config);

    /**
     * After create the profile we want to list it, this way we call 'GET_PROFILE' passing
     * res.data as a payload, where we'll get the current user profile
     */
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    /**
     * Here we're calling setAlert that will show the message according the value of edit,
     * if it is true it means that the profile was just updated then will show 'Profile Update', other way
     * we show 'Profile Created'
     */
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    //config well be used to show that we're coping with data in json format
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // res receives the return of a request to '/api/profile/experience' passing formData as value, this way we're udating the experiences
    const res = await axios.put("/api/profile/experience", formData, config);

    //after update the profile we're call the UPDATE_PROFILE to change the states and update the values in our frontEnd
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch(setAlert("Experience Removed", "success"));
  }
};

//Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  /**
   * the if bellow is used to encapsulet the action of delete the user account, this way
   * the user will receive a pop-up in frontEnd asking if he has certanty of this action
   */
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete("/api/profile");
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: ACCOUNT_DELETED,
      });
      dispatch(setAlert("Your account has been permanantly deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
