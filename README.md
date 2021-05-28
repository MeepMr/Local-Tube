# Local-Tube

## Table-of-Contents

- [Introduction](https://github.com/MeepMr/Local-Tube#introduction)
- [What it does](https://github.com/MeepMr/Local-Tube#what-it-doeas)
- [Prerequisites](https://github.com/MeepMr/Local-Tube#prerequisite)
- [Installation](https://github.com/MeepMr/Local-Tube#installation) Coming soon to a GitHub near you
- [License](https://github.com/MeepMr/Local-Tube#license)


## Introduction
On my approach to get rid of as many Google-Services as possible, I decided to host my own YouTube.
Since no creator would upload videos to my crappy website (understandable), I had to come up with a Solution.
Meet Local-Tube, a locally hosted Node.js Web-Server, that downloads and delivers all Videos available on YouTube.

## What it does
- If you open `www.yourdomain.com/download/<videoId>/<filename>` in your browser, your browser should start to download the YouTube-Video with the matching id
- When opening `www.youtdomain.com/register/<videoId>` the webserver will register the video-id in its database and download it to the specified path.
You will then be presented with a website containing a link to watch the video, as soon as it is downloaded.
- By opening `www.yourdomain.com/watch/<videoId>` your browser will play the previously downloaded video.
- You can delete a video from the database and the file-system by navigating to `www.yourdomain.com/delete/<videoId>`
- By navigating to `www.yourdomain.com/delete/all` the webserver will delete all registered videos from the File-System and then wipe its database

## Prerequisite

### General things
- A Home-Server [e.g. a raspberry pi] or a Remote-Server
- Enough Storage-Space to store the videos
- A good internet-Connection to improve the download-Time
- A domain and a dyn-dns client installed. [This is needed, so you can watch the downloaded Videos, wherever you are]
- Alternative: A VPN-Connection to your Server

### Dependencies for Local-Tube
- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org)
- [Youtube-dl](https://ytdl-org.github.io/youtube-dl/download.html)
- Run `youtube-dl --version` to check if Youtube-dl is installed correctly.
- [FFmpeg](https://ffmpeg.zeranoe.com/builds/)
- Run `ffmpeg -version` to check if FFmpeg is installed correctly.
- Proceed only if above 2 packages are installed correctly and versions are displayed in terminal.

## Installation
- Clone the Repository into a Folder on your server
```
git clone https://github.com/MeepMr/Local-Tube.git /<direction-to>/<your-folder>
```
- edit the Configuration-File in /<your-folder>/data/configuration.json
    - The `domain` is used to generate links to your Local-Tube server
    - The `port` is where the Server listens for requests. You should configure port-forwarding
    in your Router to the server on the specified port
    - In the specified `videoDirectory` the Server will store all downloaded Videos.
    Please make sure, the user starting the Server has read- and write-permissions
    - The `videoHeight` describes the maximum amount of vertical Pixel the downloaded Video
    is allowed to have
    - The `temporaryDuration` indicates a temporarily downloaded Video will remain on the
    File-System before it is being deleted
    - By toggling the `allowEncoding` option, you can enable the Server to encode the downloaded Videos.
    Then higher-quality Video- and Audio-files can be downloaded. ***CAUTION: THIS IS VERY RESOURCE-INTENSIVE***
- make sure the server starts by executing
```
 node /<your-folder>/bin/server.js
 ```

**Further Instructions Coming soon (tm)**

## License

MIT License

Copyright (c) 2021 MeepMr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
