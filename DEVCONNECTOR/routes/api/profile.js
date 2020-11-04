const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //auth method responsible for check if the user has a valid token
const Profile = require("../../models/Profile"); //Model profile that can be used for search and insert data in our database
const User = require("../../models/User"); //Model user that can be used for search and insert data in our database

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    //profile receive the result of the search in our database for the user.id sent from the frontEnd
    //remember that auth method send a object called user as a request, this way we can use 'req.user.id'
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]); //populate add the attributes name and avatar to user

    //check if the profile const is empty, this way it means that the user don't has a profile in our database
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    //if everything is ok we are going to send the profile for the frontEnd
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
