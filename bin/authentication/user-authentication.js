import {accountTokens} from "../fileSystem/dataFiles.js";

/**
 * @param name {String}
 * @param token {String}
 * @returns {Boolean}
 */
let verifyIdentity = function (name, token) {

    return name && accountTokens.get(name) === token;
};

export {verifyIdentity}
