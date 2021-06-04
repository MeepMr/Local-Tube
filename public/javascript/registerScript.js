const textField = document.getElementById('register-text');
const registerButton = document.getElementById('register-button');
let scripts = document.getElementsByTagName('script');
let moduleRegex = '';

for (let script of scripts) {

    if (script.src.endsWith('/javascript/registerScript.js')) {

        moduleRegex = script.id;
        break;
    }
}

let registerVideoRequest = function () {

    const input = textField.value;

    if(input.match(`(${moduleRegex})-[a-zA-Z0-9]+`)) {

        textField.value = '';
        fetch(`/register/${input}`).then( () => {textField.style.animation = 'flashGreen 0.5s forwards linear normal';});
    } else {

        textField.style.animation = 'flashRed 0.5s forwards linear normal';
    }

    setTimeout(() => {    textField.style.animation = '';
    }, 1500);
};

registerButton.addEventListener('click', registerVideoRequest);
textField.addEventListener('keypress', (key) => {

    if(key.key === 'Enter')
        registerVideoRequest();
});
