const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema({
	pose: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Pose",
	},
	duration: {
		type: Number,
	},
	data: {
		type: Object,
	},
});

module.exports = mongoose.model("Recording", recordingSchema);
