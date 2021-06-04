/**
 * @param title {String}
 * @param identifier {String}
 * @param date {Date}
 * @param downloaded {boolean}
 * @constructor
 */
function videoObject(title, identifier, date, downloaded = false) {

    this.title = title;
    this.identifier = identifier;
    this.date = date;
    this.downloaded = downloaded;
    this.failed = 0;
    this.lastDownload = undefined;
    this.duration = 0;
    this.watchedSeconds = 0;
}

export {videoObject}
