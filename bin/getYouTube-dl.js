const {exec} = require('child_process');
const formatString = require('../data/dataManager').formatString;

/**
 * @param videoId {String}
 * @param output {String}
 */
let youtubeDl = async function (videoId, output) {

    await exec(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${formatString}' -o '${output}'`);
};

module.exports = youtubeDl;
