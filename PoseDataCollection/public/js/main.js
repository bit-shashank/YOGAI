const VIDEO_WIDTH = 800;
const VIDEO_HEIGHT = 600;
const ASPECT_RATIO = VIDEO_WIDTH/VIDEO_HEIGHT;
const videoElement = document.getElementsByClassName("input_video")[0];
const outputCanvas = document.getElementsByClassName("output_canvas")[0];
const outputCanvasCtx = outputCanvas.getContext("2d");
const startBtn=document.getElementById("startBtn");
const saveBtn=document.getElementById("saveBtn");
const inputCanvas= document.getElementsByClassName("input_canvas")[0];
const inputCanvasCtx= inputCanvas.getContext("2d");
const prepTimeSpan=document.getElementById("prepTime");
const coverDiv=document.getElementsByClassName("cover")[0];
const recordTimeSpan = document.getElementById("recordTime");
const recordingStatDiv=document.getElementsByClassName("recordingStats")[0];
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");


let isRecording=false;
let saving=false;
let recordedPoseData=[];
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
    outputCanvasCtx.save();
    outputCanvasCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    // Only overwrite existing pixels.
    // outputCanvasCtx.globalCompositeOperation = "source-in";
    // outputCanvasCtx.fillStyle = "#00FF00";
    // outputCanvasCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    // Only overwrite missing pixels.
    // outputCanvasCtx.globalCompositeOperation = "destination-atop";
    //  outputCanvasCtx.drawImage(results.image, 0, 0, outputCanvas.width, outputCanvas.height);
    // outputCanvasCtx.globalCompositeOperation = "source-over";


    drawConnectors(outputCanvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2});
    drawLandmarks(outputCanvasCtx, results.poseLandmarks, { color: "#FF0000", radius: 1});
    outputCanvasCtx.restore()
    inputCanvasCtx.drawImage(results.image,0,0,inputCanvas.width,inputCanvas.height);
    drawConnectors(inputCanvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 5});

    if(isRecording){
        recordedPoseData.push({
            poseLandmarks:results.poseLandmarks,
            poseWorldLandmarks:results.poseWorldLandmarks
        })
    }
    
}



function start(){
    if(isRecording){
        return;
    }
    coverDiv.style.display="flex";
    startBtn.innerText="Preparing"
    let preparingTime=10;
    var prepareTimer=setInterval(()=>{
        if(preparingTime<=0){
            clearInterval(prepareTimer);
            coverDiv.style.display="none";
            startRecording();
        }
        preparingTime-=1;
        prepTimeSpan.textContent=preparingTime;
    },1000);
}

function startRecording(){
    isRecording=true;
    recordedPoseData=[];
    recordingStatDiv.style.display="flex";
    startBtn.innerText="Recording";
    startBtn.style.background="red";
    let recordingTime=10;
    var recordingTimer=setInterval(()=>{
        if(recordingTime<=0){
            clearInterval(recordingTimer);
            isRecording=false;
            recordingStatDiv.style.display="none";
            startBtn.style.background="black";
            startBtn.innerText="Start";
            toggleModal();
        }
        recordingTime-=1;
        recordTimeSpan.textContent=recordingTime;
    },1000)
}


function saveData(){
    if(recordedPoseData.length===0){
        return;
    }

    if(saving){
        return;
    }

    saving=true;
    saveBtn.innerText="Saving..";
    saveBtn.style.backgroundColor="green";
    let data = { 
        poseName: "Tree Pose",
        duration:10,
        data:recordedPoseData,
    };

    async function save(){
        let res= await fetch("/addPoseData", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        });
        saveBtn.innerText="Saved";
        toggleModal();
        saving=false;
        saveBtn.innerText="Save";
    }
    save();
}

function toggleModal() {
    modal.classList.toggle("show-modal");
}
