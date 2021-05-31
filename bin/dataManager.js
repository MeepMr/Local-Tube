import {daysSinceDate, weeksSinceDate} from './meep-utils.js';
import {configurationFile, serverConfiguration, videoList, newVideos, deleteVideoFromFs} from './dataFiles.js';
import {writeListToFs} from "./dataFiles.js";

const formatString = configurationFile.allowEncoding ? `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${configurationFile.videoHeight}]+bestaudio/best[ext=mp4]/best`
                                                     : `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`;

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
let getNewVideosList = function () {

    let allVideosString = '';

    for (let video of newVideos) {

        allVideosString += `<p>${serverConfiguration.domain}/watch/${video.identifier}</p>`;
    }

    emptyList(newVideos);
    return allVideosString;
};

/**
 * @returns {Array<videoObject>}
 */
let getVideoList = function () {

    return videoList;
};

let saveLists = function () {

    writeListToFs(videoList, 'videoData');
    writeListToFs(newVideos, 'newVideos');
};

/**
 * @param video {videoObject}
 * @param list {Array.<videoObject>}
 */
let addVideoToList = function (video, list) {

    list.push(video);
    saveLists();
};

/**
 * @param index {Number}
 * @param list {Array.<videoObject>}
 */
let removeVideoFromList = function (index, list) {

    list.splice(index, 1);
    saveLists();
};

/**
 * @param list {Array.<videoObject>}
 */
let emptyList = function (list) {

    list.splice(0, list.length);
    saveLists();
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

        deleteVideoFromFs(`${serverConfiguration.videoDirectory}/${videoId}.mp4`);
        removeVideoFromList(index, videoList);
    }
};

let deleteAllVideos = function () {

    let videoIds = [];

    for (let video of videoList) {

        videoIds.push(video.identifier);
    }

    for (let videoId of videoIds) {

        deleteVideoFromFs(`${serverConfiguration.videoDirectory}/${videoId}.mp4`);
    }

    emptyList(videoList);
};

/**
 * @param interval {Number} Number of Weeks since download
 * @param days {Number} Number of Days
 * @returns {Number} Number of old videos
 */
let deleteOldVideos = function (interval, days) {

    let oldVideoIds = findOldVideos(interval, days);

    for(let videoId of oldVideoIds) {

        deleteVideo(videoId);
    }

    return oldVideoIds.length;
};

/**
 * @param interval {Number}
 * @param days {Number}
 * @returns {Array.<String>}
 */
let findOldVideos = function (interval, days) {

    let foundOldVideoIds = [];

    for(let video of videoList) {

        if(weeksSinceDate(video.date) >= interval && daysSinceDate(video.date) % 7 >= days) {

            foundOldVideoIds.push(video.identifier);
        }
    }

    return foundOldVideoIds;
};

export {addVideo}
export {findVideo, getVideo, getVideoList, getNewVideosList}
export {writeListToFs, saveLists}
export {restoreProgress, cleanUpAndExit} from './startup-exit.js';
export {deleteVideo, deleteOldVideos, deleteAllVideos}
export {serverConfiguration, configurationFile, formatString}
