const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Pose=require('./models/PoseData');

let connURL="mongodb+srv://loneCoder:QWERTY1234@cluster0-avdpm.mongodb.net/poseDataDB?retryWrites=true&w=majority";
mongoose.connect(connURL);

const con = mongoose.connection;
con.on("open", () => {
	console.log("Connected To Database");
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(express.json({ limit: '5mb' }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('');
});

app.post('/addPoseData',async (req,res)=>{
  const poseData=new Pose({
    name:req.body.name,
    duration:req.body.duration,
    data:req.body.data,
  });
  try{
    await poseData.save();
    res.status(200).json({
      msg:"Saved Successfully",
    });
  }
  catch(err){
    res.status(503).json({
      msg:"Unable to save error occured"
    })
    }
});
  
app.listen(process.env.PORT || 8000);
