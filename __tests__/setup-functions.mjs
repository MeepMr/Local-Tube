import {failedDownloads, newVideos, videoList} from "../bin/fileSystem/dataFiles.js";
import {saveLists} from "../bin/fileSystem/dataManager.js";
import {videoObject} from '../models/Video.js';

const oldVideoList = [];
let oldFailedDownloads = [];
let oldNewVideos = [];

let saveAndClearLists = async function () {

    let video;

    for (video of videoList)
        oldVideoList.push(video);

    for (video of failedDownloads)
        oldFailedDownloads.push(video);

    for (video of newVideos)
        oldNewVideos.push(video);

    clearLists();
};

let restoreAndSaveLists = function () {

    let video;
    clearLists();

    for (video of oldVideoList)
        videoList.push(video);

    for (video of oldFailedDownloads)
        failedDownloads.push(video);

    for (video of oldNewVideos)
        newVideos.push(video);

    saveLists();
};

let clearLists = function () {

    videoList.splice(0, videoList.length);
    failedDownloads.splice(0, failedDownloads.length);
    newVideos.splice(0, newVideos.length);
};


/**
 * @param videoId {String}
 * @returns {videoObject}
 */
let getTestVideo = function (videoId) {

    return new videoObject(videoId, videoId, new Date());
};

export {saveAndClearLists, restoreAndSaveLists, clearLists, getTestVideo}
