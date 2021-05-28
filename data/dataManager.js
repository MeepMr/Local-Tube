/** @type {Array.<videoObject>} */
const videoList = require('./videoData.json');

/** @type {Array.<videoObject>} */
const newVideos = require('./newVideos.json');

const configurationFile = require('./configuration.json');
const fs = require('fs');
const downloadManager = require("../bin/downloadManager");

/**
 * @param video {videoObject}
 * @returns {boolean}
 */
let addVideo = function (video) {

    if (findVideo(video.identifier) === -1) {

        addVideoToList(video, videoList);
        addVideoToList(video, newVideos);
        return true;
    } else {

        return false;
    }
};

/**
 * @param videoId {String}
 * @returns {videoObject | null}
 */
let getVideo = function (videoId) {

    let videoIndex = findVideo(videoId);

    return videoIndex !== -1 ? videoList[videoIndex] : null;
};

/**
 * @returns {String}
 */
let getNewVideos = function () {

    let allVideosString = '';

    for (let video of newVideos) {

        allVideosString += `<p>${configurationFile.domain}/watch/${video.identifier}</p>`;
    }

    emptyList(newVideos);
    return allVideosString;
};

let updateLists = function () {

    fs.writeFile('./data/videoData.json', JSON.stringify(videoList), () => {});
    fs.writeFile('./data/newVideos.json', JSON.stringify(newVideos), () => {});
};

/**
 * @param video {videoObject}
 * @param list {Array.<videoObject>}
 */
let addVideoToList = function (video, list) {

    list.push(video);
    updateLists();
};

/**
 * @param index {Number}
 * @param list {Array.<videoObject>}
 */
let removeVideoFromList = function (index, list) {

    list.splice(index, 1);
    updateLists();
};

/**
 * @param list {Array.<videoObject>}
 */
let emptyList = function (list) {

    list.splice(0, list.length);
    updateLists();
};

/**
 * @param videoId {String}
 * @returns {number}
 */
let findVideo = function (videoId) {

    let index = 0;

    for (let video of videoList) {

        if (video.identifier === videoId) {

            return index;
        }

        index++;
    }

    return -1;
};

/**
 * @param videoId {String}
 */
let deleteVideo = function (videoId) {

    let index = findVideo(videoId);
    if (index !== -1) {

        deleteVideoFromFs(`${configurationFile.videoDirectory}/${videoId}.mp4`);
        removeVideoFromList(index, videoList);
    }
};

let deleteAllVideos = function () {

    let videoIds = [];

    for (let video of videoList) {

        videoIds.push(video.identifier);
    }

    for (let videoId of videoIds) {

        deleteVideoFromFs(`${configurationFile.videoDirectory}/${videoId}.mp4`);
    }

    emptyList(videoList);
};

/**
 * @param path {String}
 */
let deleteVideoFromFs = function (path) {

    fs.unlink(path, () => { });
};

/**
 * @param interval {Number} Number of Weeks since download
 * @returns {Number} Number of old videos
 */
let deleteOldVideos = function (interval) {

    let oldVideoIds = findOldVideos(interval);

    for(let videoId of oldVideoIds) {

        deleteVideo(videoId);
    }

    return oldVideoIds.length;
};

/**
 * @param interval {Number}
 * @returns {Array.<String>}
 */
let findOldVideos = function (interval) {

    let foundOldVideoIds = [];

    for(let video of videoList) {

        if(weeksSinceDate(video.date) >= interval) {

            foundOldVideoIds.push(video.identifier);
        }
    }

    return foundOldVideoIds;
};

/**
 * @param date {Date}
 * @returns {Number}
 */
let weeksSinceDate = function (date) {

    let millisecondsSinceDate = Date.now() - new Date(date);
    return Math.floor(millisecondsSinceDate / 604800000);
};

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoList));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify(newVideos));
    process.exit(0);
};

let restoreProgress = function () {

     for(let video of videoList) {

         if(!video.downloaded) {

             downloadManager.addToQueue(video);
         }
     }

     downloadManager.startDownload().catch();
};

module.exports.addVideo = addVideo;

module.exports.findVideo = findVideo;
module.exports.getVideo = getVideo;
module.exports.getNewVideosList = getNewVideos;

module.exports.deleteVideo = deleteVideo;
module.exports.deleteOldVideos = deleteOldVideos;
module.exports.deleteAllVideos = deleteAllVideos;

module.exports.cleanUpAndExit = cleanUpAndExit;
module.exports.restoreProgress = restoreProgress;

module.exports.domain = configurationFile.domain;
module.exports.videoDirectory = configurationFile.videoDirectory;
module.exports.tempDuration = configurationFile.temporaryDuration;
module.exports.formatString = configurationFile.allowEncoding ? `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${configurationFile.videoHeight}]+bestaudio/best[ext=mp4]/best`
                                                              : `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`;
