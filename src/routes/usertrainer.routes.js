import { Router } from "express";

import { addUserTrainer , getUserTrainer, EditTrainer} from "../controllers/usertrainer.controller.js";

import authentication from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/select-trainer').post(authentication,addUserTrainer);

router.route('/get-trainer').get(authentication, getUserTrainer);

router.route('/edit-trainer/:usertrainer_id').put(authentication, EditTrainer);

export default router;


