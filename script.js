// Websocket

const webSocket = new WebSocket('ws://localhost:8888/websocket');

webSocket.onopen = function () {
    console.log('WebSocket connection established');
    const name = prompt('What is your name: ')
    webSocket.send(name);
};

webSocket.onmessage = function (event) {
    const message = event.data;
    let parts = message.split(':')
    let lineBreak = document.createElement('br')
    let nameElem = document.createElement('span')
    nameElem.classList.add('fw-bold', 'text-info')
    nameElem.innerHTML = parts[0]
    messagesOutput.appendChild(nameElem)
    messagesOutput.innerHTML += `: ${parts[1]}`
    messagesOutput.appendChild(lineBreak)
};

webSocket.onclose = function (event) {
    console.log('WebSocket connection closed with code ' + event.code);
    let closeElem = document.createElement('span')
    closeElem.classList.add('text-secondary')
    closeElem.innerHTML = 'Websocket connection closed';
    messagesOutput.appendChild(closeElem)
};

// Events

const messageInput = document.getElementById('message-input');
const messagesOutput = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const closeButton = document.getElementById('close-button');

function sendMessage() {
    const message = messageInput.value;
    webSocket.send(message);
    messageInput.value = '';
}

messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        sendMessage();
    }
});

sendButton.addEventListener('click', function () {
    sendMessage();
});

closeButton.addEventListener('click', function () {
    webSocket.close();
});