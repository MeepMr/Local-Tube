/**
 * @param delay {Number} Delay in ms
 * @param error {boolean}
 * @param val {String}
 * @returns {Promise.<String>}
 */
const delay = function (delay, error = false, val = 'Timer') {

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
const weeksSinceDate = function (date) {

    return millisecondIntervalsSinceDate(604800000, date);
};

/**
 * @param date {Date}
 * @returns {Number}
 */
const daysSinceDate = function (date) {

    return millisecondIntervalsSinceDate(86400000, date);
};

/**
 * @param milliseconds {Number}
 * @param date {Date}
 * @returns {number}
 */
const millisecondIntervalsSinceDate = function (milliseconds, date) {

    const millisecondsSinceDate = Date.now() - new Date(date);
    return Math.floor(millisecondsSinceDate / milliseconds);
};

export {daysSinceDate, weeksSinceDate, delay}
