const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //auth method responsible for check if the user has a valid token
const Profile = require("../../models/Profile"); //Model profile that can be used for search and insert data in our database
const User = require("../../models/User"); //Model user that can be used for search and insert data in our database
const { check, validationResult } = require("express-validator/check");

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    //profile receive the result of the search in our database for the user.id, remember that auth method send a object called user as a request, this way we can use 'req.user.id'
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]); //populate add the attributes name and avatar to user

    //check if the profile const is empty, this way it means that the user doesn't has a profile in our database
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

// @route  POST api/profile
// @desc   Create or update a user profile
// @access Private
/**
 * We're using the auth middleware, this way only users with a valid token
 * can have access to this route, check that we're also usign the check
 * method to validate that user has informed the status and skills
 */
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    /**
     * const erros receive the validationResult response and if any error
     * be detected the if bellow will sent a error status, listening the values
     * that wasn't informed
     */
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() });
    }

    //this const will destructure the values bellow from req.body, that is the value that will be send by the frontEnd
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile Object
    /**
     * Here we are adding the values above to a unique object called profileFields
     * first is checked if the value exists using the if and then the value is
     * inserted in it correct place in profileFields object
     */
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    /**
     * the skills value is received from the frontEnd as a String,
     * this way we have to split it by ',' and use the map to see all the
     * values and the trim method to remove any white space in the values
     */
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build social object
    /**
     * Using the social values also sent by the frontEnd we're populating the profileFields
     * object, adding this values in the object social
     */
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //try responsible for update or insert the values in our database
    try {
      //check if already exist a profile for this user in our database, if true the profile will be update
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      /*
        if we passed through the if above it means that the user doens't have a profile yet, this way
        we're creating an instance from model Profile sendind profileFields as a paramether and then
        using the method save() in our instance 'profile', this way we're saving the profile in ou database
      */
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    //const profiles receive all the profiles in our database also the name and the avatar
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
  /**
   * try bellow is used for list a user profile according the id sent in our url
   * it will take the user_id from the url and then find in our database the information
   * from the user and send it to frontend
   */
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.log(err.message);

    //if the error kind is ObjectID it means that the user_id sent by the frontend is incorrect
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
