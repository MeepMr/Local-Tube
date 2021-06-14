import express from 'express';
import {verifyIdentity} from "../bin/authentication/user-authentication.js";
const loginRouter = express.Router();

loginRouter.use(function (req, res, next) {

    const url = req.url;
    const cookies = req.cookies;
    const accountName = cookies['Account'];
    const accountToken = cookies[accountName];

    if(url.match('^[/](stylesheets|javascript|thumbnails|login|images|favicons|api)')) {

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

export {loginRouter}
