import { Router } from "express";
import * as controllers from '../controllers/BasicActions';

const router = Router();

router.get('/', controllers.loadHomePage);

export default router;