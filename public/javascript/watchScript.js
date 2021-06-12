// noinspection JSUnresolvedFunction

const video = getVideoElement();
const nextVideoLink = getNextVideo();
const videoId = video.id;
let duration;
let started = false;
let pip = false;
let fullscreen = false;

video.addEventListener('playing', Loop);
video.addEventListener('loadedmetadata', logMetaData);
video.addEventListener('enterpictureinpicture', () => {pip = true;});
video.addEventListener('leavepictureinpicture', () => {pip = false;});
document.addEventListener('webkitfullscreenchange', () => {fullscreen = !fullscreen;});
document.addEventListener('fullscreenchange', () => {fullscreen = !fullscreen;});

/**
 * @returns {HTMLVideoElement}
 */
function getVideoElement () {

    let videos = document.getElementsByTagName('video');
    return videos.item(0);
}

/**
 * @returns {HTMLLinkElement | Boolean}
 */
function getNextVideo () {

    const videoElementCollection = document.getElementById('aside-video-list').children;
    if(videoElementCollection === null)
        return false;

    const firstVideoElement = videoElementCollection.item(0);
    return firstVideoElement.children.item(0);
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
    } else if (keySymbol === 'P') {

        await togglePip();
    } else if (keySymbol === 'N') {

        if (key.shiftKey && !key.metaKey) {

            if(key.ctrlKey) {

                await fetch(`/delete/${videoId}`);
                nextVideoLink.click();
            } else {

                nextVideoLink.click();
            }
        }
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

    await fetch(`/watch/watchedTime/${videoId}/${video.currentTime}`);
}

async function Loop () {

    if(!started) {

        started = true;

        while (!video.paused) {
            await delay(30*1000);
            await logSecondsWatched();
        }

        started = false;
        await logSecondsWatched();
    }
}

async function logMetaData() {

    duration = video.duration;
    await fetch(`/watch/duration/${videoId}/${duration}`);
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
