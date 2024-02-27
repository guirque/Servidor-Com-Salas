import { Request as expressRequest, Response as expressResponse } from 'express';
import { rooms, room } from '../../data/data'

//Returns an object holding the number of rooms, their names, the number of users in it and the user limit.
export default function loadRooms(req: expressRequest, res: expressResponse): void {

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