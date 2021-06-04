import fs from "fs";
import {failedDownloads, newVideos, serverConfiguration, videoList} from "../fileSysem/dataFiles.js";
import {addToQueue, tryDownload} from "../download/downloadManager.js";
import {loadModules, moduleRegEx} from "./module-loader.js";
import localTube from "./local-tube.js";

let cleanUpAndExit = function () {

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoList));
    fs.writeFileSync('./data/newVideos.json', JSON.stringify(newVideos));
    fs.writeFileSync('./data/failedDownloads.json', JSON.stringify(failedDownloads));
    process.exit(0);
};

let restoreProgress = async function () {

    for(let video of videoList) {

        if(!video.downloaded) {

            addToQueue(video);
        }
    }

    await loadModules();

    tryDownload().catch();

    localTube.locals = {
        server: {
            title: serverConfiguration.title,
            description: serverConfiguration.description
        },
        author: serverConfiguration.author,
        moduleRegularExpression: moduleRegEx
    };
};

export {restoreProgress, cleanUpAndExit}