const mongoose = require('mongoose');

const poseDataSchema =  new mongoose.Schema({
  poseName:{
     type: String,
  },
  duration:{
      type: Number,
  },
  data:{
      type:Object,
  }
});

module.exports = mongoose.model("Pose",poseDataSchema);