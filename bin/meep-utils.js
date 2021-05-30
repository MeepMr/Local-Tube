/**
 * @param delay {Number} Delay in ms
 * @param error {boolean}
 * @param val {String}
 * @returns {Promise.<String>}
 */
module.exports.delay = function (delay, error = false, val = 'Timer') {

    return new Promise( function (resolve, reject) {

        setTimeout(function () {

            if(error) reject(val);
            else resolve(val);
        }, delay);
    });
};