const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	photo: {
		data: Buffer, // space until image is fully downloaded; in binary format
		contentType: String
	}, 
	postedBy: {
		type: ObjectId,
		ref: "User" // reference the User model
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Post", postSchema);