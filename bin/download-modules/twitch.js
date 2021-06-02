const moduleName = 'twitch';

/**
 * @param video {videoObject}
 * @returns {String}
 */
const getUrl = function (video) {

    let videoId = video.identifier.substring(7);
    return `https://www.twitch.tv/videos/${videoId}`;
};

/**
 * @param videoId {String}
 * @returns {String}
 */
const getOutPut = function (videoId) {

    return `${videoId}.mp4`;
};

export {moduleName, getUrl, getOutPut}