// Require Express so we can use its Router
const express = require('express');
const { getPosts, createPost, postsByUser, postById, isPoster, updatePost, deletePost } = require('../controllers/post');
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { createPostValidator } = require('../validator');

const router = express.Router();

// using the Router, give it to postController method, which would send a simple message
router.get('/posts', getPosts);
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/posts/by/:sssuserId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
// Validation should not interfere with post functions.

// any route containing :userId, our app will first execute userById()
// which will add user info as "profile" in req
router.param("userId", userById);
router.param("postId", postById);

module.exports = router;



