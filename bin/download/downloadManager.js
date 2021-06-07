import {exec} from 'child_process';
import {delay} from '../meep-utils.js';
import {
    addVideoToList,
    configurationFile,
    formatString,
    saveLists,
    serverConfiguration
} from '../fileSystem/dataManager.js';
import {addToFailedList, getReadyVideos} from "./failedDownloads.js";
import {failedDownloads, newVideos} from "../fileSystem/dataFiles.js";
import {spliceVideoId} from "../web-server/module-loader.js";
import {cleanUpAndExit} from "../web-server/startup-exit.js";

/** @type {Boolean} disable Downloads for development reasons*/
const enableDownloads = true;

/** @type {videoObject[]} */
let queue = [];

/** @type {Boolean} */
let downloading = false;

/** @type {Boolean} */
let saveShutdown = false;

/**
 * @param video {videoObject}
 */
let addToQueue = function (video) {

    queue.push(video);
};

let tryDownload = async function () {

    if (!downloading && enableDownloads) {

        await startDownload();
    } else if(!enableDownloads) {

        //Simulate a download of 30 Seconds
        console.log('Download Started');
        await delay(30*1000);
        console.log('Download Completed');
    }
};

let startDownload = async function () {

    downloading = true;

    while (queue.length > 0) {

        let nextVideo = queue.pop();
        let {module, identifier} = spliceVideoId(nextVideo.identifier);

        let success = await downloadThumbnail(module.getUrl(nextVideo, identifier), module.getOutPut(nextVideo.identifier));
        success = success && await downloadVideo(module.getUrl(nextVideo, identifier), module.getOutPut(nextVideo.identifier));
        if(success) {
            nextVideo.downloaded = true;
            if(nextVideo.lastDownload !== undefined) {

                nextVideo.date = new Date();
                addVideoToList(nextVideo, newVideos);
            }
        } else {

            nextVideo.failed++;

            if(nextVideo.failed < 10)
                queue.push(nextVideo);
             else
                addToFailedList(nextVideo);
        }
        saveLists();

        if(queue.length === 0 && failedDownloads.length > 0 ) {

            for(let video of getReadyVideos()) {

                queue.push(video);
            }
        }
    }

    if(saveShutdown) {

        cleanUpAndExit();
    }

    downloading = false;
};

/**
 * @param url {String}
 * @param outPut {String}
 * @returns {Boolean}
 */
let downloadVideo = async function (url, outPut) {

    try {
        await Promise.race([youTubeDl(url, `${serverConfiguration.videoDirectory}/${outPut}`, `-f '${formatString}'`),
                                    delay(configurationFile.downloadTimeout*60*1000, true, 'Download timed out')]);
        return true;
    } catch (error) {

        console.log(`Download Errored: ${error}`);
        return false;
    }
};

/**
 * @param url {String}
 * @param outPut {String}
 * @returns {Boolean}
 */
let downloadThumbnail = async function (url, outPut) {

    try {

        await Promise.race([youTubeDl(url, `${serverConfiguration.videoDirectory}/${outPut}`, `--write-thumbnail --skip-download -f 'best[ext=jpg]/best[ext=webp]/best'`),
            delay(configurationFile.downloadTimeout*60*1000, true, 'Download timed out')]);
        return true;
    } catch (error) {

        console.log(`Download Errored: ${error}`);
        return false;
    }
};

/**
 * @param url {String}
 * @param output {String}
 * @param [options] {String}
 * @returns {Promise.<String>}
 */
let youTubeDl = async function (url, output, options = '') {

    console.log(`Downloading ${url}`);

    return new Promise( function (resolve, reject) {

        exec(`youtube-dl '${url}' -r '${configurationFile.bitrate}' ${options} -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

export {queue, saveShutdown}
export {tryDownload, addToQueue, youTubeDl}
