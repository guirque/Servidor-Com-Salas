import { Request as expressRequest, Response as expressResponse } from 'express';
import { room, getRoom } from '../../data/data';

export default function enterRoom(req: expressRequest, res: expressResponse): void {
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