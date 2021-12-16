/** @type {HTMLCollection.<HTMLAnchorElement>} */
const nextVideoLinks = document.getElementsByClassName('videoLink');

/** @type {HTMLAnchorElement} */
let anchorElement;

for(anchorElement of nextVideoLinks) {

    anchorElement.addEventListener('click', nextVideoListener);
}

/**
 * @param mouseEvent {MouseEvent}
 */
async function nextVideoListener (mouseEvent) {

    if(mouseEvent.button === 0) {

        mouseEvent.preventDefault();
        const targetLink = mouseEvent.target;

        if((video.currentTime / video.duration) > 0.92) {
            await fetch(`/delete/${videoId}`);
        }

        window.location.href = targetLink.href;
    }
}
