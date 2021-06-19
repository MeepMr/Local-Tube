import express from "express";
import {serverConfiguration} from "../../bin/fileSystem/dataFiles.js";
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

    fs.writeFileSync('./data/serverConfiguration.json', JSON.stringify(serverConfiguration));
    res.redirect('/man/exit');
});

export {configurationSetupRouter}
