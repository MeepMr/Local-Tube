import express from 'express';
import {verifyIdentity} from "../bin/authentication/user-authentication.js";
import {rsaKey} from "../bin/fileSystem/dataManager.js";
const loginRouter = express.Router();

loginRouter.use(function (req, res, next) {

    const url = req.url;
    const cookies = req.cookies;
    const accountName = cookies['Account'];
    const accountToken = cookies[accountName];

    if(url.match('^[/](stylesheets|javascript|thumbnails|login|images|favicons|api)')) {

        next();
    } else {

        if (accountToken !== undefined && verifyIdentity(accountName, accountToken)) {

            setCookies(res, accountName, accountToken);
            next();
        } else
            showLoginPage(res);
    }
});

loginRouter.get('/login', function (req, res) {

    const {accountName, token} = req.query;
    if(verifyIdentity(accountName, token)) {

        setCookies(res, accountName, token);
        res.redirect('/');
    } else
        showLoginPage(res);
});

/**
 * @param res {Response}
 */
const showLoginPage = function (res) {

    res.render('login', {publicKey:rsaKey.publicKey.export({type:'spki', format:'pem'})});
};

/**
 * @param res {Response}
 * @param accountName {String}
 * @param accountToken {String}
 */
const setCookies = function (res, accountName, accountToken) {

    res.cookie('Account', accountName, {maxAge: 60*60*1000});
    res.cookie(accountName, accountToken, {maxAge: 60*60*1000});
};

export {loginRouter}
