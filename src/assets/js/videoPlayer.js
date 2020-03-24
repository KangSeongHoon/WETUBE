
const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playButton = document.getElementById("jsPlayButton");
const VolumButton = document.getElementById("jsVolumButton");
const FullScreenButton = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, { method: "POST" });
}

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}
function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        VolumButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
    } else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        VolumButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    FullScreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    FullScreenButton.addEventListener("click", goFullScreen);
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
    }
    FullScreenButton.innerHTML = '<i class="fas fa-compress"></i>';
    FullScreenButton.removeEventListener("click", goFullScreen);
    FullScreenButton.addEventListener("click", exitFullScreen);
}
const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

async function setTotalTime() {
    const blob = await fetch(videoPlayer.src)
        .then(response => response.blob());
    const duration = await getBlobDuration(blob);
    console.log(duration);
    const totalTimeString = formatDate(videoPlayer.duration);
    totalTime.innerHTML = totalTimeString;
    setInterval(getCurrentTime, 1000);
}
function handleEnded() {
    registerView();
    videoPlayer.currentTime = 0;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
    const { target: { value } } = event;
    videoPlayer.volume = value;
    if (value >= 0.7) {
        VolumButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.4) {
        VolumButton.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        VolumButton.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
}

function init() {
    videoPlayer.volume = "0.5";
    playButton.addEventListener("click", handlePlayClick);
    VolumButton.addEventListener("click", handleVolumeClick);
    FullScreenButton.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
    init();
}
