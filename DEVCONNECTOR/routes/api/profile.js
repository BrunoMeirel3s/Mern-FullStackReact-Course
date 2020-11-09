const express = require("express");
const router = express.Router();
const request = require("request"); //method used for make request for apis
const config = require("config"); //allow us to use variables created in other documents such as the githubClient and secret that we're going to use in github api
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

// @route  Delete api/profile
// @desc   Delete profile, user & posts
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    //@todo - remove users posts

    //remove provile - we're searching the user in our database by it's id sent by the auth middleware
    await Profile.findOneAndRemove({ user: req.user.id });

    //remove user - - we're searching the user in our database by it's id sent by the auth middleware
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  Put api/profile/experience
// @desc   Add profile experience
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //if one of the atributes above don't come from the frontend the user will receive a error
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //we're destructuring the attributes bellow from the req.body that is the values sent by the frontEnd
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    //here we're creating a new object using the attributes destructured above
    //this new object contains the values sent by the user
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      //searching for the user profile using it's id sent by the auth method
      const profile = await Profile.findOne({ user: req.user.id });

      //the unshift method add the new experience in the experience object begin
      profile.experience.unshift(newExp);

      //save() is used for update the value experience with the values above
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  Delete api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //he're we are selecting one profile usign the user.id that was sent by auth method
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    /**
     * removeIndex search in the array the attibute with the index similar to
     * req.params.exp_id that is the id sent by the url
     */
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    //we're removing the removeIndex that is the value selected by the frontEnd
    profile.experience.splice(removeIndex, 1);

    //saving the delete in our database
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  Put api/profile/education
// @desc   Add profile education
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //if one of the atributes above don't come from the frontend the user will receive a error
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //we're destructuring the attributes bellow from the req.body that is the values sent by the frontEnd
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    //here we're creating a new object using the attributes destructured above
    //this new object contains the values sent by the user
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      //searching for the user profile using it's id sent by the auth method
      const profile = await Profile.findOne({ user: req.user.id });

      //the unshift method add the new experience in the experience object begin
      profile.education.unshift(newEdu);

      //save() is used for update the value profile with the values above
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  Delete api/profile/education/:edu_id
// @desc   Delete education from profile
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    /**
     * removeIndex search in the array the attibute with the index similar to
     * req.params.exp_id that is the id sent by the url
     */
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    //we're removing the value selected in our frontEnd
    profile.education.splice(removeIndex, 1);

    //saving the education update
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  Get api/profile/github/:username
// @desc   Get user repos from github
// @access Public
router.get("/github/:username", (req, res) => {
  try {
    /**
     * the const options is used to define the url, method and headers that we're going to use to access
     * github api, the uri contains 'req.params.username' that is the username that we want to see the repositories
     * the 'githubClientId' is the value that we get in github when we create an aplication for use their api,
     * the 'githubsecret' is also a value the we get in github, these two values are necessary to access the github api
     */
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    /*
     *we're using the request method that allow us to access diferent apis, the options value is the
     *const that we defined above. Error, response and body are both the kind of responses that we can obtain
     *from the api request
     */
    request(options, (error, response, body) => {
      //if error we're going to send the error on a console
      if (error) console.error(error);

      //if statuscode is diferent of 200 it means that we can't find the url sent
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      //json.parse is used to format the response that we receive from github api
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
