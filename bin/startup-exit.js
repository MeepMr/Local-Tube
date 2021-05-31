import fs from "fs";
import {failedDownloads, newVideos, videoList} from "./dataFiles.js";
import {addToQueue, tryDownload} from "./downloadManager.js";

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoList));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify(newVideos));
    fs.writeFileSync('./data/failedDownloads', JSON.stringify(failedDownloads));
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

export {restoreProgress, cleanUpAndExit}