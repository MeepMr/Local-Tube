import express from 'express';
import fs from "fs";

const feedbackRouter = express.Router();
/** @type {Array.<String>} */
const questions = JSON.parse(fs.readFileSync('./bin/feedback-server/questions.json').toString());

/** @type {Array.<>} */
const answers = JSON.parse(fs.readFileSync('./bin/feedback-server/answers.json').toString());

feedbackRouter.get('/', function (req, res) {

    res.redirect('/feedback');
});

feedbackRouter.get('/feedback', function (req, res) {

    res.render('feedback', {
        usage: 'Konfi',
        response: false,
        responseMessage: undefined,
        questions: questions
    });
});

feedbackRouter.post('/feedback', function (req, res) {

    console.log(req.body);
    answers.push(req.body);
    fs.writeFile('./bin/feedback-server/answers.json', JSON.stringify(answers), () => { });
    res.render('feedback', {
        usage: 'Konfi',
        response: true,
        responseMessage: 'Danke!',
        questions: undefined
    });
});

export {feedbackRouter}
