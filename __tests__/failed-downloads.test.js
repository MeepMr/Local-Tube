import {clearLists, getTestVideo, restoreAndSaveLists, saveAndClearLists} from "./setup-functions.mjs";
import {loadModules} from "../bin/web-server/module-loader.js";
import {addToQueue, tryDownload} from "../bin/download/downloadManager.js";
import {failedDownloads} from "../bin/fileSystem/dataFiles";
import {addToFailedList, getReadyVideos} from "../bin/download/failedDownloads";
import {daysSinceDate} from "../bin/meep-utils";

beforeAll(saveAndClearLists);
beforeAll(loadModules);
afterAll(restoreAndSaveLists);

beforeEach(clearLists);

test('Downloading a not existing video', async function () {

    const testVideo = getTestVideo('youtube-BliBla123');
    const testMap = new Map().set(testVideo.identifier, testVideo);

    addToQueue(testVideo);
    await tryDownload();
    expect(failedDownloads).toStrictEqual(testMap);
}, 60*1000);

test('Add Videos to ready list', function () {

    const testVideo1 = getTestVideo('test1');
    testVideo1.failed = 10;

    const testVideo2 = getTestVideo('test2');
    testVideo2.failed = 11;

    addToFailedList(testVideo1);
    addToFailedList(testVideo2);

    const testMap = new Map().set(testVideo1.identifier, testVideo1).set(testVideo2.identifier, testVideo2);

    expect(failedDownloads).toStrictEqual(testMap);
});

test('Find ready videos', function () {

    const today = new Date();
    const date = today.getUTCDate();

    const testVideo1 = getTestVideo('test1');
    testVideo1.failed = 10;
    testVideo1.lastDownload = new Date(today.setDate(date > 2 ? date-5: 27));

    const testVideo2 = getTestVideo('test2');
    testVideo2.failed = 11;

    failedDownloads.set(testVideo1.identifier, testVideo1).set(testVideo2.identifier, testVideo2);
    const testMap = new Map().set(testVideo1.identifier, testVideo1);

    expect(getReadyVideos()).toStrictEqual(testMap);
});
