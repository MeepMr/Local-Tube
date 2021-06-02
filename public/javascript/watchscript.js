const video = getVideoElement();
const videoId = video.id;
video.addEventListener('play', TenSecondLoop);
let percent;
let duration;
let started = false;

function getVideoElement () {

    let videos = document.getElementsByTagName('video');
    return videos.item(0);
}

function logPercentWatched () {

    percent = video.currentTime / duration;
    fetch(`/watch/percent/${videoId}/${percent}`).then();
}

async function TenSecondLoop () {

    if(!started) {

        started = true;
        duration = video.duration;
        let response = await fetch(`/watch/percent/${videoId}`);
        let responseJSON = await response.json();
        percent = responseJSON.percent;

        video.currentTime = percent * duration;

        while (percent < 1) {

            await delay(30*1000);
            logPercentWatched();
        }
    }
}

 function delay (delay) {

    return new Promise( function (resolve) {

        setTimeout(resolve, delay);
    });
}
