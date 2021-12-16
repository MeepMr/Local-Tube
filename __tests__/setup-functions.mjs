import {allDownloadedVideos, failedDownloads, newVideos, videoList} from "../bin/fileSystem/dataFiles.js";
import {emptyList} from "../bin/fileSystem/dataManager.js";
import {videoObject} from '../models/Video.js';

/** @type {Map.<String, videoObject>} */
let oldVideoList = new Map();

/** @type {Map.<String, videoObject>} */
let oldFailedDownloads = new Map();

/** @type {Map.<String, videoObject>} */
let oldNewVideos = new Map();

/** @type {Map.<String, Boolean>} */
let oldAllDownloadedVideos = new Map();

let saveAndClearLists = async function () {

    videoList.forEach((video, key) => oldVideoList.set(key, video));
    failedDownloads.forEach((video, key) => oldFailedDownloads.set(key, video));
    newVideos.forEach((video, key) => oldNewVideos.set(key, video));
    allDownloadedVideos.forEach((value, key) => oldAllDownloadedVideos.set(key, value));

    clearLists();
};

let restoreAndSaveLists = function () {

    clearLists();

    oldVideoList.forEach((video, key) => videoList.set(key, video));
    oldFailedDownloads.forEach((video, key) => failedDownloads.set(key, video));
    oldNewVideos.forEach((video, key) => newVideos.set(key, video));
    oldAllDownloadedVideos.forEach((value, key) => allDownloadedVideos.set(key, value));
};

let clearLists = function () {

    emptyList(videoList);
    emptyList(failedDownloads);
    emptyList(newVideos);
    emptyList(allDownloadedVideos);
};


/**
 * @param videoId {String}
 * @returns {videoObject}
 */
let getTestVideo = function (videoId) {

    return new videoObject(videoId, videoId, new Date());
};

export {saveAndClearLists, restoreAndSaveLists, clearLists, getTestVideo}
