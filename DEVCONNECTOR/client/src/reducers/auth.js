import { REGISTER_SUCCESS, REGISTER_FAIL } from "../actions/types"; //Types imported from action/types

/**
 * The initialState gather all the states from our reducer, here is the values
 * that are going to be change by our auth action
 */
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

/*
 * The action paramether will be passed when we call the reducer in our auth action
 * action will contain the type and payload that are being destructured bellow
 */
export default function (state = initialState, action) {
  const { type, payload } = action;
  /**
   * The switch bellow is used to vary according to the type sent in the dispatch method
   * in our auth action, if the type be register_success it means that the user was able to enter in our system
   * this way we set the token that in the browser localstorage
   */
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
}
