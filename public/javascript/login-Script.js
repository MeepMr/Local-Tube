
/** @type {HTMLFormElement} */
const form = document.getElementById('local-tube-login-form');
const tokenField = document.getElementById('account-token');
const submitButton = document.getElementById('local-tube-login-form-submit-button');
const key = document.getElementById('rsa-key').value;

submitButton.addEventListener('click', encryptPassword);

/**
 * @param event {MouseEvent}
 */
async function encryptPassword (event) {
    event.preventDefault();

    const plainTextInput = tokenField.value;
    const rsaKey = await importRsaKey(key);

    const encoder = new TextEncoder();
    const token = encoder.encode(plainTextInput);

    const enc = await crypto.subtle.encrypt({name:'RSA-OAEP', }, rsaKey, token);

    //Base64 Encode the encrypted Password
    tokenField.value = btoa(String.fromCharCode(...new Uint8Array(enc)));

    form.submit();
    tokenField.value = plainTextInput;
}
