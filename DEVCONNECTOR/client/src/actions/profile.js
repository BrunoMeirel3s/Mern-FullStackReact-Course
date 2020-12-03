import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./types";

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
