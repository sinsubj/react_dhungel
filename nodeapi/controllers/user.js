const _ = require('lodash');
const User = require("../models/user");
const formidable = require('formidable');
const fs = require('fs'); // core NodeJS module

// run whenever url has "user" in it
exports.userById = (req, res, next, id) => {
	User.findById(id)
	// populate followers and following users array
	.populate('following', '_id name')
	.populate('followers', '_id name')
	.exec((err, user) => {
		if(err || !user) {
			return res.status(400).json({
				error: "User not found"
			});
		}
		
		req.profile = user // add profile object in req with user info
		next();
	});
};

exports.hasAuthorization = (req, res, next) => {
	const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
	if(!authorized) {
		return res.status(403).json({ // 403: unauthorized
			error: "User is not authorized to perform this action."
		}); 
	}
};

exports.allUsers = (req, res) => {
	User.find((err, users) => {
		// callback for handling errors
		if(err) {
			return res.status(400).json({
				error: err
			});
		}
		
		// if no error; return an array, instead of an object {user:user}
		res.json(users);
	}).select("name email updated created");
}

// return req.profile from request
exports.getUser = (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: "Photo coulud not be uploaded"
      })
    }
    // save user
    let user = req.profile
    user = _.extend(user, fields); // mutate & override original user object
    user.updated = Date.now();

    // handle the file
    if(files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }

    user.save((err, result) => {
      if(err) {
        return res.status(400).json({
          error: err
        })
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
	});
};

exports.userPhoto = (req, res, next) => {
  if(req.profile.photo.data) {
		// Tell client that the data has such content-type
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
}

exports.deleteUser = (req, res, next) => {
	let user = req.profile;
	user.remove((err, user) => {
		if(err) {
			return res.status(400).json({
				error: err
			});
		}
		
		res.json({ message: "User deleted successfully" });
	});
};

// follow unfollow
exports.addFollowing = (req, res, next) => {
	User.findByIdAndUpdate(req.body.userId, {$push: {following:req.body.followId}}, (err, result) => {
		if(err) {
			return res.status(400).json({error: err})
		}
		next();
	});
};

exports.addFollower = (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId, 
		{$push: {followers:req.body.userId}}, 
		{new: true},
	)
		.populate('following', '_id name')
		.populate('followers', '_id name')
		.exec((err, result) => {
			if(err) {
				return res.status(400).json({
					error: err
				})
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
};

exports.removeFollowing = (req, res, next) => {
	User.findByIdAndUpdate(
		req.body.userId, 
		{$pull: {following:req.body.followId}}, 
		(err, result) => {
			if(err) {
				return res.status(400).json({error: err})
			}
		next();
	});
};

exports.removeFollower = (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId, 
		{$pull: {followers:req.body.userId}}, 
		{new: true}
	)
		.populate('following', '_id name')
		.populate('followers', '_id name')
		.exec((err, result) => {
			if(err) {
				return res.status(400).json({
					error: err
				})
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
};