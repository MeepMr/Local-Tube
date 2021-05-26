/**
 * @type {Array.<videoObject>}
 */
const videoList = require('./videoData.json');
const configurationFile = require('./configuration.json');

const fs = require('fs');

/**
 * @param video {videoObject}
 * @returns {boolean}
 */
let addVideo = function (video) {

    if(findVideo(video.identifier) === -1) {

        videoList.push(video);
        updateList();
        return true;
    } else {

        return false;
    }
};

let updateList = function () {

    fs.writeFile('./data/videoData.json', JSON.stringify(videoList), () => {});
};

/**
 *
 * @param videoId {String}
 * @returns {number}
 */
let findVideo = function (videoId) {

    let index = 0;

    for(let video of videoList) {

        if(video.identifier === videoId) {

            return index;
        }

        index++;
    }

    return -1;
};

/**
 *
 * @param videoId {String}
 */
let deleteVideo = function (videoId) {

    let index = findVideo(videoId);
    if(index !== -1) {

        fs.unlink(`${configurationFile.videoDirectory}/${videoId}.mp4`, () => {}); //Remove Video from the file-System
        videoList.splice(index, 1); //Remove video from index
        updateList();
    }
};

let deleteAllVideos = function () {

    let videoIds = [];

    for(let video of videoList) {

        videoIds.push(video.identifier);
    }

    for(let videoId of videoIds) {

        fs.unlink(`${configurationFile.videoDirectory}/${videoId}.mp4`, () => {}); //Remove Video from the file-System
    }

    videoList.splice(0, videoList.length);

    updateList();
};

module.exports.addVideo = addVideo;
module.exports.findVideo = findVideo;
module.exports.deleteVideo = deleteVideo;
module.exports.deleteAllVideos = deleteAllVideos;
module.exports.domain = configurationFile.domain;
module.exports.videoDirectory = configurationFile.videoDirectory;
module.exports.tempDuration = configurationFile.temporaryDuration;
module.exports.resolution = configurationFile.videoHeight;