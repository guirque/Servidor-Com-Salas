import { Router } from "express";
import loadHomePage from "../controllers/HomePage/loadHomePageController";
import enterRoom from "../controllers/Room/enterRoomController";
import createRoom from "../controllers/Room/createRoomController";
import loadRooms from "../controllers/HomePage/loadRoomsController";

const router = Router();

router.get('/', loadHomePage);

router.get('/rooms', loadRooms);

router.get('/rooms/:num', enterRoom);

router.post('/createRoom', createRoom);

export default router;