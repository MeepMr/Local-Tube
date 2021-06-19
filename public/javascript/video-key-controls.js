// noinspection JSUnresolvedFunction

let pip = false;
let fullscreen = false;

video.addEventListener('enterpictureinpicture', () => {pip = true;});
video.addEventListener('leavepictureinpicture', () => {pip = false;});
document.addEventListener('webkitfullscreenchange', () => {fullscreen = !fullscreen;});
document.addEventListener('fullscreenchange', () => {fullscreen = !fullscreen;});

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

        if (key.shiftKey && !key.metaKey && nextVideoLink !== false) {

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
