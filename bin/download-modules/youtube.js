const moduleName = 'youtube';

/**
 * @param video {videoObject}
 * @returns {String}
 */
const getUrl = function (video) {

    let videoId = video.identifier.substring(8);
    return `https://www.youtube.com/watch?v=${videoId}`;
};

export {moduleName, getUrl}
