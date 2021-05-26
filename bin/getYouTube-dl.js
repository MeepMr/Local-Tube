const {exec} = require('child_process');
const formatString = require('../data/dataManager').formatString;

/**
 * @param videoId {String}
 * @param output {String}
 */
let youtubeDl = async function (videoId, output) {

    return new Promise( function (resolve, reject) {

        exec(`youtube-dl 'https://www.youtube.com/watch?v=${videoId}' -f '${formatString}' -o '${output}'`,
            (error, buffer) => error ? reject(error) : resolve(buffer));
    });
};

module.exports = youtubeDl;
