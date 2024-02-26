let body = document.querySelector('body');

async function getRooms() {
    let usernameNode: HTMLInputElement | null = document.querySelector('#username-text');
    if (usernameNode) localStorage.setItem('username', usernameNode.value);
    if (body) body.innerHTML =
        `
        <div id="page-2">
            <div id="findRoomText">
                <h1>Rooms Available</h1>
                <h2>Check for current rooms that you may join or create a room with your desired settings. </h2>
            </div>
            <main id="RoomPicker">
            </main>
            <input id="newRoom" type="button" value="+" style="visibility: hidden;" onClick="newRoomButton();">
        </div>
    `;
    let main = document.querySelector('main');

    if (main != null) {
        let roomInfo: Array<Object> = JSON.parse(await (await fetch('/rooms')).json());
        main.innerHTML = '';
        console.log(roomInfo);
        //Adding Rooms
        if (roomInfo != null) roomInfo.forEach((roomInfo: any) => {
            if (main) main.innerHTML +=
                `<a class="roomIcon" id="${roomInfo.number}" href="/rooms/${roomInfo.number}">
                    <div class="roomNumber">${roomInfo.number}</div>
                    <div>
                        <b>${roomInfo.name}</b>
                        <i id="${roomInfo.number}-limit">${roomInfo.numOfUsers}/${roomInfo.maxUsers}</i>
                    </div>
                </a>`;
        })
        else {
            main.innerHTML = 'No rooms found. Have you considered creating a new one?';
        }

        //Adding New Room Button
        let button: HTMLInputElement | null = document.querySelector('#newRoom');
        if (button) {
            button.addEventListener('click', () => { });
            button.style.visibility = 'visible';
        }
    }
}
// Create New Room

function newRoomButton() {
    if (body && !document.querySelector('#createRoomForm')) {
        body.innerHTML +=
            `
            <form id="createRoomForm" method="POST" action="/createRoom">
                <b>Create New Room</b>
                <label for="createRoomForm">Room Name: <input type="text" name="name" placeholder="my room" required></label>
                <label for="createRoomForm"> Max Number of Users: <input type="number" name="max" max="8" min="2" required></label>
                <input type="submit" value="Create Room">
            </form>
        `;
    }
}