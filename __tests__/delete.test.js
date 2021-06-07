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

    expect(videoList.size).toEqual(0);
    const testVideo = getTestVideo('youtube-gxPmvXKPqR8');
    addToQueue(testVideo);
    await tryDownload();

    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo.identifier}.mp4`)).toBe(true);

    console.log(videoList);

    expect(addVideo(testVideo)).toBe(true);
    const testMap = new Map().set(testVideo.identifier, testVideo);
    expect(videoList).toStrictEqual(testMap);

    deleteVideo(testVideo.identifier);
    await delay(1000);
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo.identifier}.mp4`)).toBe(false);
    expect(videoList.size).toEqual(0);

}, 60*1000);

test('Delete All Registered Videos', async function () {

    expect(videoList.size).toEqual(0);
    const testVideo1 = getTestVideo('youtube-gxPmvXKPqR8');
    const testVideo2 = getTestVideo('youtube-32qEgJPT6bs');

    expect(addVideo(testVideo1)).toBe(true);
    expect(addVideo(testVideo2)).toBe(true);
    const testMap = new Map().set(testVideo1.identifier, testVideo1).set(testVideo2.identifier, testVideo2);
    expect(videoList).toStrictEqual(testMap);

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
    expect(videoList.size).toEqual(0);
}, 2*60*1000);
