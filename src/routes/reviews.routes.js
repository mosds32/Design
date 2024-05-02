import { Router } from "express";

import { addreviews , getReviews} from "../controllers/reviews.controller.js";

import authentication from "../middlewares/auth.middlewares.js";

const router = Router();


router.route('/add-reviews').post(authentication, addreviews);

router.route('/get-reviews').get(authentication, getReviews);
export default router;
