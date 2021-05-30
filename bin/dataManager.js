import fs from 'fs';
import {addToQueue, tryDownload} from "./downloadManager.js";
import {daysSinceDate, weeksSinceDate} from './meep-utils.js';

/** @type {Array.<videoObject>} */
const videoList = JSON.parse(fs.readFileSync('./data/videoData.json').toString());

/** @type {Array.<videoObject>} */
const newVideos = JSON.parse(fs.readFileSync('./data/newVideos.json').toString());

/** @type {{videoHeight:Number, temporaryDuration:Number, allowEncoding:Boolean, downloadTimeout:Number, bitrate:String}}*/
const configurationFile = JSON.parse(fs.readFileSync('./data/configuration.json').toString());

/** @type {{domain:String, port:String, videoDirectory:String}} */
const serverConfiguration = JSON.parse(fs.readFileSync('./data/serverConfiguration.json').toString());
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

        allVideosString += `<p>${configurationFile.domain}/watch/${video.identifier}</p>`;
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
 * @param list {Array.<videoObject>}
 * @param filename {String}
 */
let writeListToFs = function (list, filename) {

    fs.writeFile(`./data/${filename}.json`, JSON.stringify(list), () => {});
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
 * @param path {String}
 */
let deleteVideoFromFs = function (path) {

    fs.unlink(path, () => { });
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

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoList));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify(newVideos));
    process.exit(0);
};

let restoreProgress = function () {

     for(let video of videoList) {

         if(!video.downloaded) {

             addToQueue(video);
         }
     }

     tryDownload().catch();
};

export {addVideo}
export {findVideo, getVideo, getVideoList, getNewVideosList}
export {writeListToFs, saveLists, restoreProgress, cleanUpAndExit}
export {deleteVideo, deleteOldVideos, deleteAllVideos}
export {serverConfiguration, configurationFile, formatString}
