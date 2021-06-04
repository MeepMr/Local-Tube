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

        if (video.requestFullscreen) {
            await video.requestFullscreen();
        } else {
            /* Safari */
            video.webkitRequestFullscreen();
        }
    }
});

async function logSecondsWatched () {

    seconds = video.currentTime;
    await fetch(`/watch/watchedTime/${videoId}/${seconds}`);
    console.log('Curent time watched: ' + seconds);
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

        while (!video.paused) {

            await logSecondsWatched();
            await delay(30*1000);
        }

        await logSecondsWatched();
        started = false;
    }
}

 function delay (delay) {

    return new Promise( function (resolve) {

        setTimeout(resolve, delay);
    });

}
