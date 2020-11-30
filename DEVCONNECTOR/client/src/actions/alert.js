/**
 * The actions are responsible the make the requests to our reducers
 */
import { v4 as uuid } from "uuid"; //uuid is a library used to make ids to our alerts
import { SET_ALERT, REMOVE_ALERT } from "./types"; //states that we're going to use to make the actions happen

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid(); //id receive a random id by uuid()
  /**
   * dispatch send to our reducers the payload that contains
   * msg, alertType and id, the msg and alertType are defined in our
   * application frontEnd
   */
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  /**
   * setTimeout is used to use the dispatch method in a schedule time,
   * this way dispatch method will going to send the REMOVE_ALERT type to our reducer
   * and passing the alert id that don't need to be visible anymore
   */
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
