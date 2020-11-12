const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check"); //responsible for check if the values were filled in the frontend
const auth = require("../../middleware/auth"); //responsible for check if the user has a valid token only then he will be able to access this route

const Post = require("../../models/Post"); //Model Post, responsible for allow us to have access to methos such as save() for insert values in our database
const Profile = require("../../models/Profile"); //Model Profile, that same as model Post... allow us to have access to values defined in the model
const User = require("../../models/User"); //Model User

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    /**
     * check method is used to verify if the value text was filled in our Front End,
     * the const erros will receive the erros result if any error was found and the if bellow will
     * send the error if the const error be not empty
     */
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    try {
      //we're searching in our database the user with the same id that the current user logged in our system and removing only the password for it not to be show
      const user = await User.findById(req.user.id).select("-password");

      //the Post model's instance used for receive the attributes defined in the model Post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      //the instance newPost also receive the function save() responsible for save the value in our database
      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET api/posts
// @desc   GET all post
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    //we're getting all our posts of the database and sortting them by the newest first
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/:id
// @desc   GET post by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    //we're getting the post with the id sent by url
    const post = await Post.findById(req.params.id);

    //check if the post was not found in our database, the we return the error message
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    //check if the url sent by url is a valid ObjectId value before send a Server Error to the user
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    //we're getting the post by id in our database
    const post = await Post.findById(req.params.id);

    //check if the post exists in our database if not then it'll be send a msg to our frontend
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //Check if the user logged owns the post he wants to delete
    //the toString method is being used to transform post.user in a string because so far it's a ObjectId value
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //remove the post from our databse
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);

    //check if the url sent by url is a valid ObjectId value before send a Server Error to the user
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked, we're using the method filter in post.likes to see all
    //the likes in the post and see if the current user.id already is in post.likes this way it means that the post
    //already has been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    //if the hasn't been liked before then the user id will be add at post.likes
    //it'll be counted as a like
    post.likes.unshift({ user: req.user.id });

    //savig the update in the post
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has not already been liked, we're using the method filter in post.likes to see all
    //the likes in the post and see if the current user.id already is in post.likes this way it means that the post
    //already has been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not already been liked" });
    }

    //GET remove index
    //the map search in all post.likes array to find using the indexOf
    //the index that contains the user.id value
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    //after found the post.likes index that contains our user.id value
    //we're going to use aplice to remove that index from post.likes
    post.likes.splice(removeIndex, 1);

    //savig the update in the post
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    /**
     * check method is used to verify if the value text was filled in our Front End,
     * the const erros will receive the erros result if any error was found and the if bellow will
     * send the error if the const error be not empty
     */
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    try {
      //we're searching in our database the user with the same id that the current user logged in our system and removing only the password for it not to be show
      const user = await User.findById(req.user.id).select("-password");
      //we're searching the post in our database by it's id
      const post = await Post.findById(req.params.id);

      //the object that will be insert in post.comment
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      //the unshift method is used to insert the newComment object into post.comment
      post.comments.unshift(newComment);

      // post.save update the post values, adding the new comment
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@router DELETE api/posts/comment/:id/:comment_id
//@desc DELETE comment
//@access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //we're searching the post in our database by it's id
    const post = await Post.findById(req.params.id);

    //Pull out comment - search the comment in the post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exists" });
    }

    //Check user - make sure that the user that wants to delete the commment is the user that made the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get index to remove from comment
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
