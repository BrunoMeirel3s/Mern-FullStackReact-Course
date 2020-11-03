const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //our method to verifie if the user has a valid token
const User = require("../../models/User"); //The model that establish the connection with our database

// @route  GET api/auth
// @desc   Test Route
// @access Public
/**
 * Pay atention that we're passing auth as a parametrer to out router function, this way
 * it will check if the user has a valid token before he access our route
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
