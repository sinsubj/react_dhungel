const express = require("express");
// get the 'signup' method from the auth controller
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");

const router = express.Router();

// input: signup url & signup controller, after going through the validator
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any rout containing :userId, our app will first execute userById()
// which will add user info as "profile" in req
router.param("userId", userById);

module.exports = router;