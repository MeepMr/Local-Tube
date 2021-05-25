const {spawn} = require('child_process');

/**
 *
 * @param videoId {String}
 * @param output {String}
 * @returns {Promise.<String>}
 */
let youtubeDl = function (videoId, output) {

    return new Promise((resolve, reject) => {

        const youTubeDl = spawn('youtube-dl', [
            '-o',//output
            output,//stdout
            '-f',
            'bestvideo[height<=1080]+bestaudio/best[ext=mp4]/best',//best mp4 extension , else best
            '--recode-video',//recode video
            'mp4',//to mp4 if not mp4
            '-r', '8.5M', // Cap the download to X MByte/s
            '-a',//input stream
            '-'//stdin
        ]);

        /*Register the Promise*/
        youTubeDl.on('error',reject);
        youTubeDl.on('exit',resolve);

        /*Catching error on stdin */
        youTubeDl.stdin.on('error',err => console.log(err));

        /* Writing video url to stdin for youtube-dl */
        youTubeDl.stdin.write(`https://www.youtube.com/watch?v=${videoId}`);

        /*Closing the input stream; imp, else it waits */
        youTubeDl.stdin.end();
    });
};

module.exports = youtubeDl;