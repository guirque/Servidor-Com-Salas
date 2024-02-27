import express = require('express');
import dotenv = require('dotenv');
import router from './routes/router';
import ws = require('ws');
import { getRoom } from './data/data';

dotenv.config(); //required for process.env.Port not to return undefined.

//App
const app = express();

//Middleware
app.use(express.static(__dirname + '/view'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

//Listening
app.listen(process.env.PORT, () => {
    console.log(`<Server> Server Running on Port ${process.env.PORT}`);
})

//Setting Up Websocket Server

let ws_port: number = parseInt(process.env.WS_PORT ? process.env.WS_PORT : '443');

let wss = new ws.WebSocketServer({ port: ws_port }); //listening
console.log(`<Server> Websocket Server Active on Port ${ws_port}`);
wss.on('connection', (connection) => {
    console.log(`<!> User connected to room. Waiting for connection to be registered.`);
    connection.send(JSON.stringify({ type: 'notification', data: 'Room Connected Successfully' }));

    //Receiving Messages
    connection.on('message', (messageConnection) => {

        let messageReceived = JSON.parse(messageConnection.toString());;
        //Add connection to appropriate room.
        if (messageReceived.type == 'connect-request') {

            //IDEA: Verify if user's IP was registered on the room, for validation.
            getRoom(messageReceived.roomNum).userConnections.push(connection);
            console.log(`<Room-${messageReceived.roomNum}> User connection registered.`);
        }
        else if (messageReceived.type == 'disconnect-request') {

            let theRoom = getRoom(messageReceived.roomNum);
            theRoom.numOfUsers--; //Reduce number of users
            theRoom.userConnections = theRoom.userConnections.filter((ws_connection) => {
                return !Object.is(ws_connection, connection);
            }); //Removing connection that's no longer existent.
            console.log(`<Room-${theRoom.number}> User disconnected.`);
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