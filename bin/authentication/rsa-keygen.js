import crypto from "crypto";

/**
 * @returns {Promise<{publicKey:Buffer, privateKey:Buffer}>}
 */
const generateRsaKeyPair = function () {

    return new Promise(function (resolve, reject) {

        crypto.generateKeyPair('rsa', { modulusLength: 2048 }, (error, publicKey, privateKey) => {

            if(error)
                reject(error);
            else
                resolve({publicKey: publicKey, privateKey: privateKey});
        });
    });
};

export {generateRsaKeyPair};
