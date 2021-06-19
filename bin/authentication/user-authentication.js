import {accountTokens} from "../fileSystem/dataFiles.js";
import crypto from "crypto";
import {rsaKey} from "../fileSystem/dataManager.js";

/**
 * @param name {String}
 * @param token {String}
 * @returns {Boolean}
 */
let verifyIdentity = function (name, token) {

    try {

        const tokenBuffer = new Buffer(token, 'base64');
        const decryptedPassword = crypto.privateDecrypt( {key:rsaKey.privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256"}, tokenBuffer);
        const asciiPassword = decryptedPassword.toString('utf-8');

        return name && accountTokens.get(name) === asciiPassword;
    } catch (e) {

        return false;
    }
};

export {verifyIdentity}
