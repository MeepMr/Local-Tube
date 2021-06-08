import express from 'express';
import {accountTokens} from "../bin/fileSystem/dataFiles.js";
const loginRouter = express.Router();

loginRouter.use(function (req, res, next) {

    const url = req.url;
    const cookies = req.cookies;
    const accountName = cookies['Account'];
    const accountToken = cookies[accountName];

    if(url.match('^[/](stylesheets|javascript|thumbnails|login|register)')) {

        next();
    } else {

        if (verifyIdentity(accountName, accountToken)) {

            next();
        } else
            res.render('login');
    }
});

loginRouter.get('/login', function (req, res) {

    const {accountName, token} = req.query;
    if(verifyIdentity(accountName, token)) {

        res.cookie('Account', accountName, {maxAge: 604800000});
        res.cookie(accountName, token, {maxAge: 604800000});
        res.redirect('/');
    } else {

        res.render('login');
    }
});


/**
 * @param name {String}
 * @param token {String}
 * @returns {Boolean}
 */
let verifyIdentity = function (name, token) {

    return name && accountTokens.get(name) === token;
};

export {loginRouter}
