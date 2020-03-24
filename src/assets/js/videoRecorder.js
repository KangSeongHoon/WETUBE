const recorderContainer = document.getElementById("jsRecordercontainer");
const recorderButton = document.getElementById("recorderButton");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = (event) => {
    const { data: videoFile } = event;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile);
    link.download = "recorded.webm";
    document.body.appendChild(link);
    link.click();
}
const stopRecording = async () => {
    clearInterval(startRecording);
    videoRecorder.stop();
    recorderButton.removeEventListener("click", stopRecording);
    recorderButton.addEventListener("click", startRecording);
    recorderButton.innerHTML = "Start recording";
}

const startRecording = async () => {
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", handleVideoData);
    recorderButton.addEventListener("click", stopRecording);
    recorderButton.innerHTML = "Stop recording";
}


const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 }
        });
        videoPreview.srcObject = stream;
        videoPreview.play();
        videoPreview.muted = true;
        recorderButton.innerHTML = "Stop recording";
        streamObject = stream;
        startRecording();
    } catch (error) {
        recorderButton.innerHTML = "Cant record";
        recorderButton.removeEventListener("click", getVideo);
    } finally {
        recorderButton.removeEventListener("click", getVideo);
    }
}

function init() {
    recorderButton.addEventListener("click", getVideo);
}

if (recorderContainer) {
    init();
}