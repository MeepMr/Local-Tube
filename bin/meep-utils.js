/**
 * @param delay {Number} Delay in ms
 * @param error {boolean}
 * @param val {String}
 * @returns {Promise.<String>}
 */
let delay = function (delay, error = false, val = 'Timer') {

    return new Promise( function (resolve, reject) {

        setTimeout(function () {

            if(error) reject(val);
            else resolve(val);
        }, delay);
    });
};

/**
 * @param date {Date}
 * @returns {Number}
 */
let weeksSinceDate = function (date) {

    let millisecondsSinceDate = Date.now() - new Date(date);
    return Math.floor(millisecondsSinceDate / 604800000);
};

/**
 * @param date {Date}
 * @returns {Number}
 */
let daysSinceDate = function (date) {

    let millisecondsSinceDate = Date.now() - new Date(date);
    return Math.floor(millisecondsSinceDate / 86400000);
};

export {daysSinceDate, weeksSinceDate, delay}
