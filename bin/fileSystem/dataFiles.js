import fs from "fs";

const videoListString = JSON.parse(fs.readFileSync('./data/videoData.json').toString());
/** @type {Map.<String, videoObject>} */
const videoList = new Map(videoListString);


const newVideosString = JSON.parse(fs.readFileSync('./data/newVideos.json').toString());
/** @type {Map.<String, videoObject>} */
const newVideos = new Map(newVideosString);

const failedDownloadsString= JSON.parse(fs.readFileSync('./data/failedDownloads.json').toString());
/** @type {Map.<String, videoObject>} */
const failedDownloads = new Map(failedDownloadsString);

/** @type {{videoHeight:Number, temporaryDuration:Number, allowEncoding:Boolean, downloadTimeout:Number, bitrate:String}}*/
const configurationFile = JSON.parse(fs.readFileSync('./data/configuration.json').toString());

/** @type {{domain:String, port:String, videoDirectory:String, author:String, title:String, description:String}} */
const serverConfiguration = JSON.parse(fs.readFileSync('./data/serverConfiguration.json').toString());

/**
 * @param list {Map.<String, videoObject>}
 * @param filename {String}
 */
let writeListToFs = function (list, filename) {

    fs.writeFileSync(`./data/${filename}.json`, JSON.stringify([...list]));
};

/**
 * @param videoId {String}
 */
let deleteVideoFromFs = function (videoId) {

    fs.unlink(`${serverConfiguration.videoDirectory}/${videoId}.mp4`, () => { });
    if(fs.existsSync(`${serverConfiguration.videoDirectory}/${videoId}.jpg`)) {

        fs.unlink(`${serverConfiguration.videoDirectory}/${videoId}.jpg`, () => { });
    } else {

        fs.unlink(`${serverConfiguration.videoDirectory}/${videoId}.webp`, () => { });
    }
};

export {videoList, newVideos, failedDownloads, configurationFile, serverConfiguration}
export {writeListToFs, deleteVideoFromFs}