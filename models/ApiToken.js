/**
 * @param name {String}
 * @param token {String}
 * @param creationDate {Date}
 * @param expirationDate {Date}
 * @param valid {Boolean}
 * @constructor
 */
function ApiToken (name, token, creationDate, expirationDate = null, valid = true) {

    this.name = name;
    this.token = token;
    this.creationDate = creationDate;
    this.expirationDate = expirationDate;
    this.valid = valid;
}

export {ApiToken}
