import express from "express";
import {apiTokens} from "../../bin/fileSystem/dataFiles.js";
import {getNewApiToken} from "../../bin/authentication/api-authentication.js";
const apiConfigurationRouter = express.Router();

apiConfigurationRouter.get('/', function (req, res) {

    res.json({
        apiToken: apiTokens
    });
});

apiConfigurationRouter.get('/new', function (req, res) {

    const apiTokenName = req.query.name;
    if(apiTokenName === undefined) {

        res.send('error');
    } else {

        res.json({
            apiToken: getNewApiToken(name)
        });
    }
});

apiConfigurationRouter.get('/:apiToken', function (req, res) {

    const apiToken = req.params.apiToken;

    res.json({
        apiToken: apiTokens.get(apiToken)
    });
});

export {apiConfigurationRouter};
