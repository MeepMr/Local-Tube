/**
 * @param moduleName {String}
 * @param getUrl {function(videoObject) : String}
 * @constructor
 */
function moduleScheme (moduleName, getUrl) {

    this.moduleName = moduleName;
    /**
     * @param video {videoObject}
     * @returns {String}
     */
    this.getUrl = getUrl;
}

export {moduleScheme}
