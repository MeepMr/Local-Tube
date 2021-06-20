import express from "express";
import {allDownloadedVideos, apiTokens, newVideos, videoList} from "../bin/fileSystem/dataFiles.js";
import {apiConfigurationRouter} from "./configuration-routes/configuration-api-tokens.js";
import {configurationSetupRouter} from "./configuration-routes/configuration-setup-router.js";
const configurationRouter = express.Router();

configurationRouter.get('/', function (req, res) {

    res.render('configuration', {
        videoList: videoList,
        apiTokens: apiTokens,
        newVideos: newVideos,
        knownVideos: allDownloadedVideos
    });
});

configurationRouter.use('/api', apiConfigurationRouter);
configurationRouter.use('/setup', configurationSetupRouter);

export {configurationRouter};
