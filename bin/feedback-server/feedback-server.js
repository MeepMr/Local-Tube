import express from 'express';
import bodyParser from "body-parser";
const feedbackServer = express();

// view engine setup
feedbackServer.set('views', './bin/feedback-server');
feedbackServer.set('view engine', 'ejs');

//feedbackServer.use(express.json());
//feedbackServer.use(express.urlencoded({extended: true}));
feedbackServer.use(bodyParser.urlencoded({extended: true}));

//Manage Routers
import {feedbackRouter} from './feedbackRouter.js';
feedbackServer.use('/', feedbackRouter);


export default feedbackServer;
