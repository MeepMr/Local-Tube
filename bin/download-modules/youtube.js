const moduleName = 'youtube';

/**
 * @param video {videoObject}
 * @param videoIdentifier {String}
 * @returns {String}
 */
const getUrl = function (video, videoIdentifier = null) {

    const videoId = videoIdentifier === null ? video.identifier.substring(8) : videoIdentifier;
    return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * @param videoId {String}
 * @returns {String}
 */
const getOutPut = function (videoId) {

    return videoId;
};

export {moduleName, getUrl, getOutPut}


