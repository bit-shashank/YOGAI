
const VIDEO_WIDTH = 800;
const VIDEO_HEIGHT = 600;
const ASPECT_RATIO = VIDEO_WIDTH/VIDEO_HEIGHT;
const videoElement = document.getElementsByClassName("input_video")[0];
const inputCanvas= document.getElementsByClassName("input_canvas")[0];
const inputCanvasCtx= inputCanvas.getContext("2d");

const mpPose=window;



const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    },
});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
});
camera.start();

function onResults(results) {
   
    if (!results.poseLandmarks) {
        return;
    }
    findAngles(results.poseLandmarks);
    inputCanvasCtx.save();
    inputCanvasCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
    inputCanvasCtx.drawImage(results.image,0,0,inputCanvas.width,inputCanvas.height);
    drawConnectors(inputCanvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 5});
    drawLandmarks(inputCanvasCtx, results.poseLandmarks, { color: "#FF0000", radius: 3});

    inputCanvasCtx.restore()

}

function findAngles(poseLandmarks){
    let l1=poseLandmarks[mpPose.POSE_LANDMARKS.RIGHT_WRIST];
    let l2=poseLandmarks[mpPose.POSE_LANDMARKS.RIGHT_ELBOW];
    let l3=poseLandmarks[ mpPose.POSE_LANDMARKS.RIGHT_SHOULDER];

    
    // let l1=poseLandmarks[mpPose.POSE_LANDMARKS.RIGHT_EYE_INNER];
    // let l2=poseLandmarks[mpPose.POSE_LANDMARKS.NOSE];
    // let l3=poseLandmarks[ mpPose.POSE_LANDMARKS.LEFT_EYE_INNER];

    
    console.log(calculateAngle(l1, l2,l3));
}



function calculateAngle(landmark1, landmark2, landmark3){
    [x1, y1,_]= Object.values(landmark1);
    [x2, y2, _] =  Object.values(landmark2);
    [x3, y3, _ ]=  Object.values(landmark3);

    console.log(x1,y1);
    angle = radians_to_degrees(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2))
    if(angle<0)
        angle += 360
    return angle
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}