import {daysSinceDate, weeksSinceDate} from '../meep-utils.js';
import {
    configurationFile,
    serverConfiguration,
    videoList,
    newVideos,
    failedDownloads,
    writeMapToFs as writeListToFs,
    deleteVideoFromFs
} from './dataFiles.js';

const formatString = configurationFile.allowEncoding ? `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${configurationFile.videoHeight}]+bestaudio/best[ext=mp4]/best`
                                                     : `bestvideo[height<=${configurationFile.videoHeight}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`;

/**
 * @param video {videoObject}
 * @returns {boolean}
 */
let addVideo = function (video) {

    if (!findVideo(video.identifier)) {

        addVideoToList(video, videoList);
        addVideoToList(video, newVideos);
        return true;
    } else {

        return false;
    }
};

/**
 * @param videoId {String}
 * @returns {videoObject | undefined}
 */
let getVideo = function (videoId) {

    return videoList.get(videoId);
};

/**
 * @returns {String}
 */
let getNewVideosList = function () {

    let allVideosString = '';

    for (let video of newVideos.values()) {

        allVideosString += `<p>${serverConfiguration.domain}/watch/${video.identifier}</p>`;
    }

    emptyList(newVideos);
    return allVideosString;
};

let saveLists = function () {

    writeListToFs(videoList, 'videoData');
    writeListToFs(newVideos, 'newVideos');
    writeListToFs(failedDownloads, 'failedDownloads');
};

/**
 * @param video {videoObject}
 * @param list {Map.<String, videoObject>}
 */
let addVideoToList = function (video, list) {

    list.set(video.identifier, video);
    saveLists();
};

/**
 * @param videoId {String}
 * @param list {Map.<String, videoObject>}
 */
let removeVideoFromList = function (videoId, list) {

    list.delete(videoId);
    saveLists();
};

/**
 * @param list {Map.<String, videoObject>}
 */
let emptyList = function (list) {

    list.clear();
    saveLists();
};

/**
 * @param videoId {String}
 * @returns {boolean}
 */
let findVideo = function (videoId) {

    return videoList.get(videoId) !== undefined;
};

/**
 * @param videoId {String}
 */
let deleteVideo = function (videoId) {

    if (findVideo(videoId)) {

        deleteVideoFromFs(videoId);
        removeVideoFromList(videoId, videoList);
    }
};

let deleteAllVideos = function () {

    videoList.forEach(video => deleteVideo(video.identifier));
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

    for(let video of videoList.values()) {

        if(weeksSinceDate(video.date) >= interval && daysSinceDate(video.date) % 7 >= days) {

            foundOldVideoIds.push(video.identifier);
        }
    }

    return foundOldVideoIds;
};

export {addVideo}
export {findVideo, getVideo, getNewVideosList}
export {writeListToFs, saveLists, removeVideoFromList, addVideoToList, emptyList}
export {deleteVideo, deleteOldVideos, deleteAllVideos}
export {serverConfiguration, configurationFile, formatString}
