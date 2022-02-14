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
    poseName:req.body.poseName,
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


app.get("/recordings",async(req,res)=>{
  let poses= await Pose.find().select({"poseName":1,"duration":1})
   res.render("recordings",{poses:poses});
});


app.get("/getPoseData/:id",async (req,res)=>{
  const id=req.params.id;
  let data=await Pose.findById(id);
  res.json(data);
})

app.get("/deleteRecording/:id",async(req,res)=>{
  const id=req.params.id;
  await Pose.deleteOne({_id:id});
  res.json({msg:"deleted"});
})
app.listen(process.env.PORT || 8080);
