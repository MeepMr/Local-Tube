import fs from "fs";
import {apiTokens, failedDownloads, newVideos, videoList} from "../fileSystem/dataFiles.js";
import {addToQueue, tryDownload} from "../download/downloadManager.js";
import {loadModules} from "./module-loader.js";
import {saveLists} from "../fileSystem/dataManager.js";

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify([...videoList]));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify([...newVideos]));
    fs.writeFileSync('./data/failedDownloads.json', JSON.stringify([...failedDownloads]));
    fs.writeFileSync('./data/apiKeys.json', JSON.stringify([...apiTokens]));
    process.exit(0);
};

let restoreProgress = async function () {

    for(let video of videoList.values()) {

        if(!video.downloaded && !failedDownloads.has(video.identifier)) {

            addToQueue(video);
        }
    }

    await loadModules();

    tryDownload().catch();
    saveLists().catch();
};

export {restoreProgress, cleanUpAndExit}