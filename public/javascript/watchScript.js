// noinspection JSUnresolvedFunction

const video = getVideoElement();
const videoId = video.id;
let duration;
let seconds;
let started = false;
let pip = false;
let fullscreen = false;

video.addEventListener('playing', TenSecondLoop);
video.addEventListener('loadedmetadata', logMetaData);
video.addEventListener('enterpictureinpicture', () => {pip = true;});
video.addEventListener('leavepictureinpicture', () => {pip = false;});
document.addEventListener('webkitfullscreenchange', () => {fullscreen = !fullscreen;});
document.addEventListener('fullscreenchange', () => {fullscreen = !fullscreen;});

function getVideoElement () {

    let videos = document.getElementsByTagName('video');
    return videos.item(0);
}

window.addEventListener('keypress', async function (key) {

    let keySymbol = key.key.toUpperCase();

    if (keySymbol === 'M')
        video.muted = !video.muted;
    else if (keySymbol === ' '){

        key.preventDefault();
        if (video.paused)
            await video.play();
        else
            await video.pause();
    } else if (keySymbol === 'F') {

        await toggleFullscreen();
    } else if(keySymbol === 'P') {

        await togglePip();
    }
});

window.addEventListener('keydown', function (key) {

    if (key.code === 'ArrowLeft') { // Left-Arrow

        video.currentTime = video.currentTime-10;
    } else if (key.code === 'ArrowRight') { // Right-Arrow

        video.currentTime = video.currentTime+10;
    } else if(key.code === 'Delete' && key.ctrlKey) {

        document.getElementsByClassName('delete-button').item(0).click();
    }
});

video.addEventListener('dblclick', async function () {

    await toggleFullscreen();
});

async function logSecondsWatched () {

    seconds = video.currentTime;
    await fetch(`/watch/watchedTime/${videoId}/${seconds}`);
}

async function TenSecondLoop () {

    if(!started) {

        started = true;

        while (!video.paused) {
            await delay(30*1000);
            await logSecondsWatched();
        }

        await logSecondsWatched();
        started = false;
    }
}

async function logMetaData() {

    duration = video.duration;
    let response = await fetch(`/watch/watchedTime/${videoId}`);
    let responseJSON = await response.json();
    seconds = responseJSON.watchedSeconds;
    await fetch(`/watch/duration/${videoId}/${duration}`);
    video.controls = true;
    await delay(2000);
    video.currentTime = seconds;
}

function delay (delay) {

    return new Promise( function (resolve) {

        setTimeout(resolve, delay);
    });

}

async function toggleFullscreen () {

    if(pip)
        await togglePip();

    if (video.requestFullscreen) {
        if(fullscreen)
            await video.exitFullscreen();
        else
            await video.requestFullscreen();
    } else {

        /* Safari */
        if (fullscreen)
            await video.webkitExitFullscreen();
        else
            await video.webkitRequestFullscreen();
    }
}

async function togglePip () {

    if(pip)
        await document.exitPictureInPicture();
    else
        await video.requestPictureInPicture();
}
