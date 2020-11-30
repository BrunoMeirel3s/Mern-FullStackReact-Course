import axios from "axios"; //Allow-us to use the http requests such as post and get
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "./types"; //Types that we're going to use to make the actions happen with the reducers
import { setAlert } from "./alert"; //used to make visible the alerts in our frontEnd
import setAuthToken from "../utils/setAuthToken"; //used to add the token to the header of our axios requests

/**
 * loadUser - return the user based on the user id that logged in
 * our system
 */
export const loadUser = () => async (dispatch) => {
  /**
   * The if bellow will be used to verify if the browser has
   * the token in it local storage, if true we call setAuthToken
   * that will pass this token to the header of our axios requests
   */
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    //res receive the result of a request for "api/auth"
    const res = await axios.get("/api/auth");

    //dispatch will send to ou reducers the type and the res.data that will be our states
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    /**
     * If the user don't have a valid token he will not be allowed
     * to visit our system, so his token will be deleted in our reducer
     */
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

/**
 * register will be used to register the users in our database,
 * this way the register component will call this action
 */
export const register = ({ name, email, password }) => async (dispatch) => {
  //We're explicit seting a header, to show the content-type of our application
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  /**
   * here we're taking the name, email and password and
   * transforming all of it in a JSON object that will be passed to our
   * backend
   */
  const body = JSON.stringify({ name, email, password });

  try {
    //res make a request to api/users sending the JSON body
    //and receiving a response that will be send as a payload
    const res = await axios.post("/api/users", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    //after register the user we're going to load the user using the loadUser method
    dispatch(loadUser());
  } catch (err) {
    /**
     * If any error happen it will be send as a alert to our user
     */
    const erros = err.response.data.erros;
    if (erros) {
      /**
       * Pay attention that we're doing a forEach, to send all
       * erros to our frontEnd
       */
      erros.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

/**
 * login will be used to log in the user in our application,
 * for this login receive email and password as parameters
 */
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //we're geting email and password and making it a JSON object
  const body = JSON.stringify({ email, password });

  try {
    //res make a request to api/auth sending body that is a JSON object containing email and password
    const res = await axios.post("/api/auth", body, config);
    //dispatch send LOGIN_SUCCES as a type and res.data as a payload that is the value returned by the axios request above
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    //after log in we're going to load the user using the loadUser method
    dispatch(loadUser());
  } catch (err) {
    const erros = err.response.data.erros;
    /**
     * Pay attention that we're doing a forEach, to send all
     * erros to our frontEnd
     */
    if (erros) {
      erros.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
