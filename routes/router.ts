import { Router } from "express";
import * as controllers from '../controllers/BasicActions';

const router = Router();

router.get('/', controllers.loadHomePage);

router.get('/rooms', controllers.loadRooms);

router.get('/rooms/:num', controllers.enterRoom);

router.post('/createRoom', controllers.createRoom);

export default router;