const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require("../models/user");

exports.signup = async (req, res) => {
	// req.body contains user's signup inputs
	// look for an existing user based on the body.email
	// await for the user data to be returned
	const userExists = await User.findOne({ email: req.body.email })
	
	// If exists, 403 = unauthorized
	if(userExists) return res.status(403).json({
		error: "Email is taken!"
	})
	
	// Otherwise
	const user = await new User(req.body)
	
	// await user to be saved
	await user.save();
	res.status(200).json({ message: "Signup success! Please login." })
}

// test passwords: rrrrrr, rrrrrr9
exports.signin = (req, res) => {
	// find the user based on email; object destructuring
	const { email, password } = req.body;
	console.log(email, password);
	User.findOne({ email }, (err, user) => {
		// if error or no user
		if(err || !user) {
			return res.status(401).json({ // 401 = unauthorized
				error: "User with that email does not exist. Please sign up."
			}); 
		}
		
		// if user is found, authenticate him (email and password match)
		// create authenticate method in model and use here
		if(!user.authenticate(password)) {
			return res.status(401).json({ // 401 = unauthorized
				error: "Email and password do not match."
			}); 			
		}
		
		// generate a token with user id and secret (JWT_SECRET in .env)
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	
		// persist the token as 't' in cookie with expiry date
		res.cookie("t", token, { expire: new Date() + 9999 });
		
		// return response with user and token to frontend client
		const { _id, name, email } = user;
		return res.json({ token, user: { _id, email, name }});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("t");
	return res.json({ message: "Signout success" });
};

// pass in the configuration, secret
// expect client to send back the token (which contains secret)
// which can only happen if user is signed in
exports.requireSignin = expressJwt({
	// if the token is valid, expressJwt appends the verified user's id
	// in an auth key to the request object
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});