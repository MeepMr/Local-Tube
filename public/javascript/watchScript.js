const video = getVideoElement();
const videoId = video.id;
video.addEventListener('play', TenSecondLoop);
let duration;
let seconds;
let started = false;

function getVideoElement () {

    let videos = document.getElementsByTagName('video');
    return videos.item(0);
}

async function logSecondsWatched () {

    seconds = video.currentTime;
    await fetch(`/watch/watchedTime/${videoId}/${seconds}`);
}

async function TenSecondLoop () {

    if(!started) {

        started = true;

        let response = await fetch(`/watch/watchedTime/${videoId}`);
        let responseJSON = await response.json();
        video.currentTime = seconds = responseJSON.watchedSeconds;

        await delay(30*1000);
        duration = video.duration;
        await fetch(`/watch/duration/${videoId}/${duration}`);

        while (seconds < duration) {

            await logSecondsWatched();
            await delay(30*1000);
        }
    }
}

 function delay (delay) {

    return new Promise( function (resolve) {

        setTimeout(resolve, delay);
    });
}
