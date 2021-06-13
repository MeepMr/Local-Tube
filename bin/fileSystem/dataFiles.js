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

const accountTokensString= JSON.parse(fs.readFileSync('./data/accountTokens.json').toString());
/** @type {Map.<String, String>} */
const accountTokens = new Map(accountTokensString);

const allDownloadedVideosString= JSON.parse(fs.readFileSync('./data/allDownloadedVideos.json').toString());
/** @type {Map.<String, Boolean>} */
const allDownloadedVideos = new Map(allDownloadedVideosString);

/** @type {{videoHeight:Number, temporaryDuration:Number, allowEncoding:Boolean, downloadTimeout:Number, bitrate:String}}*/
const configurationFile = JSON.parse(fs.readFileSync('./data/configuration.json').toString());

/** @type {{domain:String, port:String, videoDirectory:String, author:String, title:String, description:String}} */
const serverConfiguration = JSON.parse(fs.readFileSync('./data/serverConfiguration.json').toString());

/**
 * @param list {Map.<String, any>}
 * @param filename {String}
 */
let writeMapToFs = function (list, filename) {

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
    allDownloadedVideos.set(videoId, false);
};

export {videoList, newVideos, failedDownloads, configurationFile, serverConfiguration, accountTokens, allDownloadedVideos}
export {writeMapToFs, deleteVideoFromFs}