import {videoObject} from "../../models/Video.js";
import {addVideo} from "../fileSystem/dataManager.js";
import {addToQueue, tryDownload} from "../download/downloadManager.js";
import {moduleRegEx} from "../web-server/module-loader.js";
import {allDownloadedVideos} from "../fileSystem/dataFiles.js";

/**
 *
 * @param name {String}
 * @param videoId {String}
 * @param unique {Boolean}
 * @returns {Boolean}
 */
let registerVideo = function (name, videoId, unique = false) {

    // Proceed if its not a unique download or, in case of a unique download, proceed if the video is not in the allDownloadedVideos Map
    if(videoId.match(moduleRegEx) && (unique ? allDownloadedVideos.get(videoId) === undefined : true)) {

        let video = new videoObject(name, videoId, new Date());

        if (addVideo(video)) {

            addToQueue(video);
            tryDownload().catch();
        }

        return true;
    } else {

        return false;
    }
};

export default registerVideo;
