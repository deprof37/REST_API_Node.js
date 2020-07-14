const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/feed");
const isAuth = require("../middlewares/is-auth");

//GET - /feed/posts ---- Get all posts
router.get("/posts", isAuth, feedController.getPosts);

//POST - /feed/post - Save a single post
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

// GET - /feed/post/:postId - Get a single post
router.get("/post/:postId", isAuth, feedController.getPost);

// PUT - /feed/post/:postId - Update a single post
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

//DELETE - /feed/post/:postId - Deleting a single post
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
