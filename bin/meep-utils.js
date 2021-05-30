/**
 * @param delay {Number} Delay in ms
 * @returns {Promise<>}
 */
module.exports.delay = function (delay) {

    return new Promise( function (resolve) {

        setTimeout(resolve, delay);
    });
};