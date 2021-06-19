/**
 * @param string {String}
 * @returns {ArrayBuffer}
 */
function stringToArrayBuffer(string) {
    const buf = new ArrayBuffer(string.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = string.length; i < strLen; i++) {
        bufView[i] = string.charCodeAt(i);
    }
    return buf;
}

/**
 * @param rsaKey {String}
 * @returns {Promise<CryptoKey>}
 */
function importRsaKey(rsaKey) {

    //Credit: Mozilla Developer Pages
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY------";
    const pemContents = rsaKey.substring(pemHeader.length, rsaKey.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = stringToArrayBuffer(binaryDerString);

    return window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );
}
