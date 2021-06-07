import {clearLists, getTestVideo, restoreAndSaveLists, saveAndClearLists} from "./setup-functions.mjs";
import {addToQueue, disableDownloads, queue, tryDownload} from "../bin/download/downloadManager.js";
import {serverConfiguration, videoList} from "../bin/fileSystem/dataFiles.js";
import {addVideo} from "../bin/fileSystem/dataManager.js";
import fs from "fs";
import {loadModules} from "../bin/web-server/module-loader.js";

beforeAll(saveAndClearLists);
beforeAll(loadModules);
afterAll(restoreAndSaveLists);

beforeEach(clearLists);

test('Download a Video', async function () {

    const testVideo = getTestVideo('youtube-gxPmvXKPqR8');
    addToQueue(testVideo);
    await tryDownload();
    expect(fs.existsSync(`${serverConfiguration.videoDirectory}/${testVideo.identifier}.mp4`)).toBe(true);
}, 30000);

test('Register a Video', function () {

    expect(videoList).toStrictEqual([]);
    const testVideo = getTestVideo('youtube-gxPmvXKPqR8');
    expect(addVideo(testVideo)).toBe(true);
    expect(addVideo(testVideo)).toBe(false);
    expect(videoList).toStrictEqual([testVideo]);
});

test('Add Video to download Queue', async function () {

    const testVideo = getTestVideo('TestVideo.bla');

    addToQueue(testVideo);
    expect(queue).toStrictEqual([testVideo]);

    disableDownloads();
    await tryDownload();
    expect(queue).toStrictEqual([]);
}, 40000);
