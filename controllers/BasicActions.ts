import * as express from 'express';

import path = require('path');
import ws = require('ws');

// Setting Data

class room {
    number: number;
    name: String;
    numOfUsers: number;
    maxUsers: number;
    userConnections: Array<ws>;

    constructor(aNumber: number, aUserConnections: Array<ws>, aName: String, aNumOfUsers: number, aMaxUsers: number) {
        this.number = aNumber;
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

let rooms: Array<room> = [];
//rooms[0] = new room(0, [], 'First', 0, 4);
let newRoomNumber = 0;


function getRoom(roomNumber: number): room {
    return rooms[roomNumber];
}

//Setting Up Websocket Server

let wss = new ws.WebSocketServer({ port: 443 }); //listening on port 443
wss.on('connection', (connection) => {
    console.log(`<!> User connected to room. Waiting for connection to be registered.`);
    connection.send(JSON.stringify({ type: 'notification', data: 'Room Connected Successfully' }));

    //Receiving Messages
    connection.on('message', (messageConnection) => {

        let messageReceived = JSON.parse(messageConnection.toString());;
        //Add connection to appropriate room.
        if (messageReceived.type == 'connect-request') {

            //IDEA: Verify if user's IP was registerd on the room, for validation.
            getRoom(messageReceived.roomNum).userConnections.push(connection);
            console.log(`<!> User connection registered in room ${messageReceived.roomNum}`);
        }
        else if (messageReceived.type == 'disconnect-request') {

            let theRoom = getRoom(messageReceived.roomNum);
            theRoom.numOfUsers--; //Reduce number of users
            theRoom.userConnections = theRoom.userConnections.filter((ws_connection) => {
                return !Object.is(ws_connection, connection);
            }); //Removing connection that's no longer existent.
            console.log(`<!> An user was disconnected from room ${theRoom.number}`);
        }
        else if (messageReceived.type == 'send-message') {
            //find the room and send to all other users in room
            getRoom(messageReceived.roomNum).userConnections.forEach((userConnection) => {
                if (!Object.is(userConnection, connection))
                    userConnection.send(JSON.stringify({
                        type: 'message',
                        data: messageReceived.message,
                        username: messageReceived.username
                    }));
            })
        }
    })
});


//Controllers
export function loadHomePage(req: express.Request, res: express.Response): void {
    res.status(200).sendFile(process.cwd() + '/view/index.html');
}

//Returns an object holding the number of rooms, their names, the number of users in it and the user limit.
export function loadRooms(req: express.Request, res: express.Response): void {

    try {
        let roomsInfo: Array<Object> = [];

        //Return each room
        rooms.forEach((aRoom: room) => {
            roomsInfo.push(aRoom.roomInfo);
        })

        roomsInfo.length >= 1 ?
            res.status(200).json(JSON.stringify(roomsInfo)) :
            res.status(200).json(null);
    }
    catch (error) {
        console.log(`<X> ${error}`);
        res.status(500).json(null);
    }

}

export function enterRoom(req: express.Request, res: express.Response): void {
    //Gather room info
    let thisRoomNum: number = parseInt(req.params.num);
    let chosenRoom: room | undefined = getRoom(thisRoomNum);

    //If room exists and isn't full    
    if (chosenRoom && chosenRoom?.numOfUsers != chosenRoom?.maxUsers) {

        //Add user to room
        if (chosenRoom) chosenRoom.numOfUsers++;

        //Send Back Room HTML
        res.status(200).sendFile(process.cwd() + '/view/room.html');
    }
    else res.redirect('/');
}

export function createRoom(req: express.Request, res: express.Response): void {

    try {
        if (req.body.name == '' || parseInt(req.body.max) > 8 || parseInt(req.body.max) < 2) throw 'Invalid values sent';
        let theRoomNum = newRoomNumber;
        rooms[theRoomNum] = new room(theRoomNum, [], req.body.name, 0, parseInt(req.body.max)); //creating room in memory
        newRoomNumber++; //updating what the next room number will be, for future room creations
        res.redirect(`/rooms/${theRoomNum}`); //requesting access to that room
    }
    catch (error) {
        console.log(`<X> Error creating new room (number ${newRoomNumber}): ${error}`);
        res.status(400).send('Sorry! Currently unable to create a new room. Please check if the data sent for room creation met the requirements.');
    }
}