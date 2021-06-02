/**
 * @param moduleName {String}
 * @param getUrl {function(videoObject) : String}
 * @param getOutPut {function(String) : String}
 * @constructor
 */
function moduleScheme (moduleName, getUrl, getOutPut) {

    this.moduleName = moduleName;
    /**
     * @param video {videoObject}
     * @returns {String}
     */
    this.getUrl = getUrl;
    this.getOutPut = getOutPut;
}

export {moduleScheme}
