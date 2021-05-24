const {spawn} = require('child_process');

/**
 *
 * @param videoId {String}
 * @param output {WriteStream}
 */
let youtubeDl = function (videoId, output) {

    const youTubeDl = spawn('youtube-dl', [
        '-o',//output
        '-',//stdout
        'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',//best mp4 extension , else best
        '--no-part', //write directly into the output-file
        '--recode-video',//recode video
        'mp4',//to mp4 if not mp4
        '-r', '8.5M', // Cap the download to X MByte/s
        '-a',//input stream
        '-'//stdin
    ])
        .on('error',err => console.log(err))
        .on('exit',code => console.log(`Ytdl exited with code ${code}`));

    /* Setting output pipe first so that we dont lose any bits */
    youTubeDl.stdout.pipe(output).on('error',err => console.log(err));

    /*Catching error on stdin */
    youTubeDl.stdin.on('error',err => console.log(err));

    /* Writing video url to stdin for youtube-dl */
    youTubeDl.stdin.write(`http://www.youtube.com/watch?v=${videoId}`);

    /*Closing the input stream; imp, else it waits */
    youTubeDl.stdin.end();
};

module.exports = youtubeDl;