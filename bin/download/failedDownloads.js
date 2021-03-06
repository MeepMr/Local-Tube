/** @type {Array.<videoObject>} */
import {removeVideoFromList} from "../fileSysem/dataManager.js";

import {failedDownloads} from '../fileSysem/dataFiles.js';
import {daysSinceDate, weeksSinceDate} from '../meep-utils.js';


/**
 * @returns {Array.<videoObject>}
 */
let getReadyVideos = function () {

    let readyVideos = [];
    let index = 0;

    for(let video of failedDownloads) {

        let weeks = weeksSinceDate(video.date);
        let day = daysSinceDate(video.lastDownload) % 7;

        if (day > 0) {

            if (weeks < 1 && video.failed < 17 || video.identifier.startsWith('twitch')) {

                readyUpVideo(readyVideos, video, index);
            } else if (weeks < 2 && video.failed < 21 && day > 7) {

                readyUpVideo(readyVideos, video, index);
            } else {

                index++;
            }
        } else if(video.identifier.startsWith('twitch') && video.failed < 50) {

            readyUpVideo(readyVideos, video, index);
        } else {

            index++;
        }
    }

    return readyVideos;
};

/**
 * @param readyVideos {Array.<videoObject>}
 * @param video {videoObject}
 * @param index {Number}
 */
let readyUpVideo = function (readyVideos, video, index) {

    removeVideoFromList(index, failedDownloads);
    readyVideos.push(video);
};

/**
 * @param video {videoObject}
 */
let addToFailedList = function (video) {

    video.lastDownload = new Date();
    failedDownloads.push(video);
};

/**
 * @returns {Array.<videoObject>}
 */
let restoreDownloads = function () {

    let failedVideos = [];

    for(let video of failedDownloads) {

        readyUpVideo(failedVideos, video, 0);
        video.failed = 0;
    }

    return  failedVideos;
};

export {addToFailedList, getReadyVideos, restoreDownloads}
