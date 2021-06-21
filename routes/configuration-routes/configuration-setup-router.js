import express from "express";
import {configurationFile, serverConfiguration} from "../../bin/fileSystem/dataFiles.js";
import fs from "fs";

const configurationSetupRouter = express.Router();

configurationSetupRouter.get('/server', function (req, res) {

    res.render('server-setup', {serverConfig: serverConfiguration});
});

configurationSetupRouter.post('/server', function (req, res) {

    const body = req.body;
    serverConfiguration.domain = body.domain;
    serverConfiguration.httpPort = body.httpPort;
    serverConfiguration.httpsPort = body.httpsPort;
    serverConfiguration.useHttps = body.useHttps === 'on';
    serverConfiguration.videoDirectory = body.videoDirectory;
    serverConfiguration.title = body.title;
    serverConfiguration.description = body.description;

    saveConfig('serverConfiguration.json', serverConfiguration);
    res.redirect('/man/exit');
});

configurationSetupRouter.get('/config', function (req, res) {

    res.render('configuration-setup', {configFile: configurationFile});
});

configurationSetupRouter.post('/config', function (req, res) {

    const body = req.body;

    configurationFile.videoHeight = body.videoHeight;
    configurationFile.temporaryDuration = body.temporaryDuration;
    configurationFile.allowEncoding = body.allowEncoding === 'on';
    configurationFile.downloadTimeout = body.downloadTimeout;
    configurationFile.bitrate = body.bitrate;

    saveConfig('configuration.json', configurationFile);
    res.redirect('/configuration');
});

/**
 * @param fileName {String}
 * @param config
 */
const saveConfig = function (fileName, config) {

    fs.writeFileSync(`./data/${fileName}`, JSON.stringify(config));
};

export {configurationSetupRouter}
