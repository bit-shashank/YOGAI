const mongoose = require("mongoose");

const poseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	img: {
		type: String,
	},
	description: {
		type: String,
	},
});

module.exports = mongoose.model("Pose", poseSchema);
