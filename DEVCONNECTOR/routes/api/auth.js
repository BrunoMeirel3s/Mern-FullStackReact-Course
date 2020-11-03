const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //our method to verifie if the user has a valid token
const User = require("../../models/User"); //The model that establish the connection with our database

// @route  GET api/auth
// @desc   Test Route
// @access Public
/**
 * Pay atention that we're passing auth as a parametrer to our router function, this way
 * it will check if the user has a valid token before he can be able to access the route
 */
router.get("/", auth, async (req, res) => {
  /**
   * The try bellow is used for find in our database the user that was sent as a parameter by the middleware auth
   * in the comand select() we're removing the password, this way we won't show the password in the frontend
   * when the comand res.json() sent the information
   */
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);//sending the object user as the response for '/' route
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
