const express = require("express");
// get the 'signup' method from the auth controller
const { userById, 
        allUsers, 
        getUser, 
        updateUser, 
        deleteUser,
        userPhoto,
        addFollowing,
        addFollower,
        removeFollowing,
        removeFollower
    } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser); 
router.delete("/user/:userId", requireSignin, deleteUser); 
// put (update the entire instance); pat (small changes); delete

// Handle photos
router.get("/user/photo/:userId", userPhoto);

// any rout containing :userId, our app will first execute userById()
// which will add user info as "profile" in req
router.param("userId", userById);

module.exports = router;