import fs from "fs";
import {failedDownloads, newVideos, videoList} from "../fileSysem/dataFiles.js";
import {addToQueue, tryDownload} from "../download/downloadManager.js";

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoList));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify(newVideos));
    fs.writeFileSync('./data/failedDownloads.json', JSON.stringify(failedDownloads));
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