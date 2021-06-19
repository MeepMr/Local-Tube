import {apiTokens} from "../fileSystem/dataFiles.js";
import {daysSinceDate} from "../meep-utils.js";
import crypto from 'crypto';
import {ApiToken} from "../../models/ApiToken.js";

/**
 * @param apiTokenString {String}
 * @returns {Boolean}
 */
const verifyApiTokenString = function (apiTokenString) {

    const verifiableApiToken = getApiTokenFromTokenString(apiTokenString);
    let verifyStatus = false;

    if( verifiableApiToken !== undefined &&
        verifiableApiToken.valid &&
        (verifiableApiToken.expirationDate === undefined || daysSinceDate(verifiableApiToken.expirationDate) < 0) ) {

        verifyStatus = true;
    }

    return verifyStatus;
};

/**
 * @param apiTokenString {String}
 * @returns {ApiToken | undefined}
 */
const getApiTokenFromTokenString = function (apiTokenString) {

    return apiTokens.get(apiTokenString);
};

/**
 * @param name {String}
 * @returns {ApiToken}
 */
const getNewApiToken = function (name) {

    const newApiToken = generateNewApiToken(name);
    apiTokens.set(newApiToken.token, newApiToken);
    return newApiToken;
};

/**
 * @param name {String}
 * @param expirationDate {Date}
 * @returns {ApiToken}
 */
const generateNewApiToken = function (name, expirationDate= null) {

    const token = crypto.randomBytes(64).toString('hex');
    return new ApiToken(name, token, new Date(), expirationDate);
};

/**
 * @param apiTokenString {String}
 */
const invalidateApiToken = function (apiTokenString) {

    const invalidatingApiToken = apiTokens.get(apiTokenString);
    invalidatingApiToken.expirationDate = new Date();
    invalidatingApiToken.valid = false;
};

export {verifyApiTokenString, getNewApiToken, invalidateApiToken}
