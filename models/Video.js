/**
 * @param title {String}
 * @param identifier {String}
 * @param date {Date}
 * @param downloaded {boolean}
 * @param failed {Number}
 * @param lastDownload {Date}
 * @param duration {Number}
 * @param watchedSeconds {Number}
 * @constructor
 */
function videoObject(title, identifier, date,
                     downloaded = false, failed = 0,
                     lastDownload = undefined, duration = 0, watchedSeconds = 0) {

    this.title = title;
    this.identifier = identifier;
    this.date = date;
    this.downloaded = downloaded;
    this.failed = failed;
    this.lastDownload = lastDownload;
    this.duration = duration;
    this.watchedSeconds = watchedSeconds;
}

export {videoObject}
