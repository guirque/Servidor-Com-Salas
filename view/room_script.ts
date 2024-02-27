let websocket = new WebSocket('ws://localhost:443');
const splitUrl = document.URL.split('/');
const roomNum = parseInt(splitUrl[splitUrl.length - 1]);
const chat = document.querySelector('#chat');

websocket.onopen = (event) => {
    websocket.send(JSON.stringify({ type: "connect-request", username: localStorage.getItem('username'), roomNum: roomNum }));
}

websocket.onmessage = (messageEvent) => {
    //console.log('<Server> ', messageEvent.data);
    let responseObj = JSON.parse(messageEvent.data);

    switch (responseObj.type) {
        case 'message':
            if (chat) chat.innerHTML +=
                `
            <div class="chat-comment">
                <div class="chat-comment-user">${responseObj.username}</div>
                <div class="chat-comment-text">${responseObj.data}</div>
            </div>
            `;
            break;
        case 'user-in-or-out':
            if (chat) chat.innerHTML +=
                `
            <div class="chat-comment">
                <div class="chat-comment-user">App</div>
                <div class="chat-comment-text warning">'${responseObj.username}' has ${responseObj.entered ? 'entered' : 'left'} the chat</div>
            </div>
            `;
            break;
    }
}

async function disconnect() {
    websocket.send(JSON.stringify({ type: 'disconnect-request', roomNum: roomNum, username: localStorage.getItem('username') }));
}

function sendMessage() {
    let message: HTMLInputElement | null = document.querySelector('#chat-send-text');
    if (!message || !message.value) return;

    websocket.send(JSON.stringify(
        {
            type: "send-message",
            roomNum: roomNum,
            username: localStorage.getItem('username') ? localStorage.getItem('username') : 'DefaultName',
            message: message.value
        }))

    if (chat) chat.innerHTML += `
        <div class="chat-comment self-chat-comment">
            <div class="chat-comment-user ">You</div>
            <div class="chat-comment-text">${message?.value}</div>
        </div>
    `;

    if (message) message.value = '';
}