const axios = require("axios").default;
/**
 * setAuthToken is used to add a header in our axios requests
 * we're going to add the header "x-auth-token" with the value passed
 * via parameter to setAuthToken
 */

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
