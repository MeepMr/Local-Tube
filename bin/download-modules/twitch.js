const moduleName = 'twitch';

/**
 * @param video {videoObject}
 * @param videoIdentifier {String}
 * @returns {String}
 */
const getUrl = function (video, videoIdentifier= undefined) {

    let videoId = videoIdentifier === undefined ? video.identifier.substring(7) : videoIdentifier;
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