const textField = document.getElementById('register-text');
const registerButton = document.getElementById('register-button');

let registerVideoRequest = function () {

    const input = textField.value;

    if(input.match('[a-z,A-Z]+-[a-z,A-Z,0-9]+') && (input.startsWith('youtube') || input.startsWith('twitch'))) {

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
