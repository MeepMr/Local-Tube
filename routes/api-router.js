import express from 'express';
import {apiRegisterRouter} from "./api-routes/api-register-video.js";
import {apiShowRouter} from "./api-routes/api-show-router.js";
import {verifyApiTokenString} from "../bin/authentication/api-authentication.js";
const apiRouter = express.Router();

apiRouter.use(function (req, res, next) {

    const token = req.query.token;

    if(token !== undefined && verifyApiTokenString(token))
        next();
    else
        res.status(511).send('Not authorised!');
});

apiRouter.use('/register', apiRegisterRouter);
apiRouter.use('/show', apiShowRouter);

export {apiRouter}