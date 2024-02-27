import { Request as expressRequest, Response as expressResponse } from 'express';
import { room, rooms } from '../../data/data';

export default function createRoom(req: expressRequest, res: expressResponse): void {

    try {
        if (req.body.name == '' || parseInt(req.body.max) > 8 || parseInt(req.body.max) < 2) throw 'Invalid values sent';
        let newRoom = new room([], req.body.name, 0, parseInt(req.body.max)); //creating room in memory
        rooms[newRoom.number] = newRoom;
        res.redirect(`/rooms/${newRoom.number}`); //requesting access to that room
    }
    catch (error) {
        console.log(`<X> Error creating new room: ${error}`);
        res.status(400).send('Sorry! Currently unable to create a new room. Please check if the data sent for room creation met the requirements.');
    }
}