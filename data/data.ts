import ws = require('ws');

// Setting Data

export class room {
    number: number;
    name: String;
    numOfUsers: number;
    maxUsers: number;
    userConnections: Array<ws>;
    static newRoomNumber: number = 0;

    constructor(aUserConnections: Array<ws>, aName: String, aNumOfUsers: number, aMaxUsers: number) {
        this.number = room.newRoomNumber++;
        this.name = aName;
        this.numOfUsers = aNumOfUsers;
        this.userConnections = aUserConnections;
        this.maxUsers = aMaxUsers;
    }

    //Returns basic room info
    get roomInfo() {
        let objInfo =
        {
            number: this.number,
            name: this.name,
            numOfUsers: this.numOfUsers,
            maxUsers: this.maxUsers
        };
        return objInfo;
    }
}

export let rooms: Array<room> = [];
//rooms[0] = new room(0, [], 'First', 0, 4);

export function getRoom(roomNumber: number): room {
    return rooms[roomNumber];
}

export function sendToAllUsers(aRoom: room, message: Object | Array<any>) {
    let messageToSend = JSON.stringify(message);
    aRoom.userConnections.forEach(
        (aUser) => {
            aUser.send(messageToSend);
        }
    )
}