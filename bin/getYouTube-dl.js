const {execSync} = require('child_process');
const formatString = require('../data/dataManager').formatString;

/**
 * @param videoId {String}
 * @param output {String}
 */
let youtubeDl = function (videoId, output) {

    execSync(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${formatString}' -o '${output}'`);
};

module.exports = youtubeDl;
