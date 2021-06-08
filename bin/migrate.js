import fs from "fs";

/** @type {Array.<videoObject>} */
const videoListArray = JSON.parse(fs.readFileSync('./data/videoData.json').toString());

/** @type {Array.<videoObject>} */
const newVideosArray = JSON.parse(fs.readFileSync('./data/newVideos.json').toString());

/** @type {Array.<videoObject>} */
const failedDownloadsArray= JSON.parse(fs.readFileSync('./data/failedDownloads.json').toString());

if(videoListArray[0].title !== undefined) {

    console.log('Migrating...');

    /** @type {Map.<String, videoObject>} */
    const videoList = new Map();

    /** @type {Map.<String, videoObject>} */
    const newVideos = new Map();

    /** @type {Map.<String, videoObject>} */
    const failedDownloads = new Map();

    for(let video of videoListArray) {

        videoList.set(video.identifier, video);
    }

    for(let video of newVideosArray) {

        newVideos.set(video.identifier, video);
    }

    for(let video of failedDownloadsArray) {

        failedDownloads.set(video.identifier, video);
    }

    fs.writeFileSync(`./data/videoData.json`, JSON.stringify([...videoList]));
    fs.writeFileSync(`./data/newVideos.json`, JSON.stringify([...newVideos]));
    fs.writeFileSync(`./data/failedDownloads.json`, JSON.stringify([...failedDownloads]));

    console.log('Migrated!');
} else {

    console.log('Nothing to migrate!');
}
