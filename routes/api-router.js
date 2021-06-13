import express from 'express';
import {apiRegisterRouter} from "./api/api-register-video.js";
import {apiShowRouter} from "./api/api-show-router.js";
const apiRouter = express.Router();

apiRouter.use('/register', apiRegisterRouter);
apiRouter.use('/show', apiShowRouter);

export {apiRouter}