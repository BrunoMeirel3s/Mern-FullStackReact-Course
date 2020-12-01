import { SET_ALERT, REMOVE_ALERT } from "../actions/types"; //states that we're going to use to make the actions happen
const initialState = []; //the states of alert reducer

export default function (state = initialState, action) {
  /**
   * Here we're destructuring type and payload from action that is sent by dispatch
   * payload has three parameters, msg, alertType and id that was generated
   * by uuid
   */
  const { type, payload } = action;
  /**
   * if type is equal to SET_ALERT we're going to pass the payload values
   * to initialState. REMOVE_ALERT will be responsible to make a filter
   * in our alert and make visible only the alerts id that are different of
   * the actual alert id sent via payload
   **/
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
