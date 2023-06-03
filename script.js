// Websocket
const webSocket = new WebSocket('ws://localhost:8888/websocket');

webSocket.onopen = function () {
    console.log('WebSocket connection established');
    const name = prompt('What is your name: ')
    webSocket.send(name);
};

webSocket.onmessage = function (event) {
    const message = event.data;
    const messageDict = processMessage(message)
    const messageColour = messageDict['colour'] || "[0, 0, 0]"
    const nameColour = processColour(messageColour)

    // name element
    const nameElem = document.createElement('span')
    nameElem.classList.add('fw-bold')
    nameElem.style.color = nameColour
    nameElem.innerHTML = messageDict['username']
    messagesOutput.appendChild(nameElem)

    // add message
    messagesOutput.innerHTML += `: ${messageDict['message']}`

    // add linebreak
    let lineBreak = document.createElement('br')
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

messagesOutput.addEventListener('DOMSubtreeModified', scrollToBottom);

window.onbeforeunload = function () {
    webSocket.close();
};

// Functions

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        webSocket.send(message);
    }
    messageInput.value = '';
}

function scrollToBottom() {
    messagesOutput.scrollTop = messagesOutput.scrollHeight;
}

function processMessage(message) {
    return JSON.parse(message)
}

function processColour(colour) {
    return `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`
}