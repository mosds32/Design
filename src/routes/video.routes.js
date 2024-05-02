import { Router } from "express";

import { addVideoController , getUserVideosController, getEditVideoControll} from "../controllers/uservideo.controller.js";

import authentication from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/user-video').post(authentication, addVideoController);

router.route('/get-video').get(authentication, getUserVideosController);

router.route('/edit-video/:uservideo_id').put(authentication, getEditVideoControll);


export default router;