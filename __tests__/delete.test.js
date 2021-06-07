import {serverConfiguration, videoList} from "../bin/fileSystem/dataFiles";
import {clearLists, getTestVideo, restoreAndSaveLists, saveAndClearLists} from "./setup-functions.mjs";
import fs from "fs";
import {addVideo, deleteAllVideos, deleteVideo} from "../bin/fileSystem/dataManager.js";
import {loadModules} from "../bin/web-server/module-loader.js";
import {addToQueue, tryDownload} from "../bin/download/downloadManager.js";
import {delay} from "../bin/meep-utils";

beforeAll(saveAndClearLists);
beforeAll(loadModules);
afterAll(restoreAndSaveLists);

beforeEach(clearLists);

test('Delete a Video', async function () {

    expect(videoList).toStrictEqual([]);
    const testVideo = getTestVideo('youtube-gxPmvXKPqR8');
    addToQueue(testVideo);
    await tryDownload();

    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo.identifier}.mp4`)).toBe(true);

    expect(addVideo(testVideo)).toBe(true);
    expect(videoList).toStrictEqual([testVideo]);

    deleteVideo(testVideo.identifier);
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo.identifier}.mp4`)).toBe(false);
    expect(videoList).toStrictEqual([]);

}, 10*1000);

test('Delete All Registered Videos', async function () {

    expect(videoList).toStrictEqual([]);
    const testVideo1 = getTestVideo('youtube-gxPmvXKPqR8');
    const testVideo2 = getTestVideo('youtube-32qEgJPT6bs');

    expect(addVideo(testVideo1)).toBe(true);
    expect(addVideo(testVideo2)).toBe(true);
    expect(videoList).toStrictEqual([testVideo1,testVideo2]);

    addToQueue(testVideo1);
    addToQueue(testVideo2);

    await tryDownload();
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo1.identifier}.mp4`)).toBe(true);
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo2.identifier}.mp4`)).toBe(true);
    console.log('All Videos downloaded');

    deleteAllVideos();

    await delay(3*1000);

    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo1.identifier}.mp4`)).toBe(false);
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo2.identifier}.mp4`)).toBe(false);
    expect(videoList).toStrictEqual([]);
}, 2*60*1000);
