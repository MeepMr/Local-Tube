// noinspection JSUnresolvedFunction

const video = getVideoElement();
const nextVideoLink = getNextVideo();
const videoId = video.id;
let duration;
let started = false;

video.addEventListener('playing', Loop);
video.addEventListener('loadedmetadata', logMetaData);

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

    try {
        const videoElementCollection = document.getElementById('aside-video-list').children;
        if (videoElementCollection.length > 0)
            return false;

        const firstVideoElement = videoElementCollection.item(0);
        return firstVideoElement.children.item(0);
    } catch (e) {

        return false;
    }
}

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
