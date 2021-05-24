/**
 *
 * @param title {String}
 * @param identifier {String}
 * @param date {Date}
 * @constructor
 */
function videoObject (title, identifier, date) {

    this.title = title;
    this.identifier = identifier;
    this.date = date;
}

module.exports = videoObject;