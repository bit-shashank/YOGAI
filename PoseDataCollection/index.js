const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Recording = require("./models/Recording");
const Pose = require("./models/Pose");

let connURL = "mongodb+srv://loneCoder:QWERTY1234@cluster0-avdpm.mongodb.net/poseDataDB?retryWrites=true&w=majority";
mongoose.connect(connURL);

const con = mongoose.connection;
con.on("open", () => {
	console.log("Connected To Database");
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
	let poses = await Pose.find({});
	res.render("", { poses: poses });
});

app.get("/record/:poseId", async (req, res) => {
	const poseId=req.params.poseId;
	const pose=await Pose.findById(poseId);
	res.render("record",{pose});
});

app.post("/addRecording", async (req, res) => {
	const recording = new Recording({
		pose: req.body.poseId,
		duration: req.body.duration,
		data: req.body.data,
	});
	try {
		await recording.save();
		res.status(200).json({
			msg: "Saved Successfully",
		});
	} catch (err) {
		res.status(503).json({
			msg: "Unable to save error occured",
		});
	}
});

app.get("/recordings", async (req, res) => {
	let recordings = await Recording.find().select({ pose: 1, duration: 1 }).sort({ _id: -1 }).populate("pose");
	res.render("recordings", { recordings });
});

app.get("/getRecording/:id", async (req, res) => {
	const id = req.params.id;
	let data = await Recording.findById(id).populate("pose");
	res.json(data);
});

app.get("/deleteRecording/:id", async (req, res) => {
	const id = req.params.id;
	await Recording.deleteOne({ _id: id });
	res.json({ msg: "deleted" });
});

app.listen(process.env.PORT || 8080);
