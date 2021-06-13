/** @type {Array.<videoObject>} */
import {removeVideoFromList} from "../fileSystem/dataManager.js";

import {failedDownloads} from '../fileSystem/dataFiles.js';
import {daysSinceDate, weeksSinceDate} from '../meep-utils.js';


/**
 * @returns {Map.<String, videoObject>}
 */
let getReadyVideos = function () {

    let readyVideos = new Map();

    for(let video of failedDownloads.values()) {

        let weeks = weeksSinceDate(video.date);
        let day = daysSinceDate(video.lastDownload) % 7;

        console.log();

        if (day > 0) {

            if (weeks < 1 && video.failed < 17 || video.identifier.startsWith('twitch')) {

                readyUpVideo(readyVideos, video);
            } else if (weeks < 2 && video.failed < 21 && day > 7) {

                readyUpVideo(readyVideos, video);
            }
        } else if(video.identifier.startsWith('twitch') && video.failed < 50) {

            readyUpVideo(readyVideos, video);
        }
    }

    return readyVideos;
};

/**
 * @param readyVideos {Map.<String, videoObject>}
 * @param video {videoObject}
 */
let readyUpVideo = function (readyVideos, video) {

    removeVideoFromList(video.identifier, failedDownloads);
    readyVideos.set(video.identifier, video);
};

/**
 * @param video {videoObject}
 */
let addToFailedList = function (video) {

    video.lastDownload = new Date();
    failedDownloads.set(video.identifier, video);
};

/**
 * @returns {Map.<String, videoObject>}
 */
let restoreDownloads = function () {

    let failedVideos = new Map();

    for(let video of failedDownloads.values()) {

        readyUpVideo(failedVideos, video);
        video.failed = 0;
    }

    return  failedVideos;
};

export {addToFailedList, getReadyVideos, restoreDownloads}
