import fs from "fs";

/** @type {Array.<videoObject>} */
const videoList = JSON.parse(fs.readFileSync('./data/videoData.json').toString());

/** @type {Array.<videoObject>} */
const newVideos = JSON.parse(fs.readFileSync('./data/newVideos.json').toString());

/** @type {Array.<videoObject>} */
const failedDownloads = JSON.parse(fs.readFileSync('./data/failedDownloads.json').toString());

/** @type {{videoHeight:Number, temporaryDuration:Number, allowEncoding:Boolean, downloadTimeout:Number, bitrate:String}}*/
const configurationFile = JSON.parse(fs.readFileSync('./data/configuration.json').toString());

/** @type {{domain:String, port:String, videoDirectory:String}} */
const serverConfiguration = JSON.parse(fs.readFileSync('./data/serverConfiguration.json').toString());

/**
 * @param list {Array.<videoObject>}
 * @param filename {String}
 */
let writeListToFs = function (list, filename) {

    fs.writeFile(`./data/${filename}.json`, JSON.stringify(list), () => {});
};

/**
 * @param videoId {String}
 */
let deleteVideoFromFs = function (videoId) {

    fs.unlink(`${serverConfiguration.videoDirectory}/${videoId}.mp4`, () => { });
    fs.unlink(`${serverConfiguration.videoDirectory}/${videoId}.jpg`, () => { });
};

export {videoList, newVideos, failedDownloads, configurationFile, serverConfiguration}
export {writeListToFs, deleteVideoFromFs}