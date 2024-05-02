import { Router } from "express";

import { addreviews , getReviews, editReview} from "../controllers/reviews.controller.js";

import authentication from "../middlewares/auth.middlewares.js";

const router = Router();


router.route('/add-reviews').post(authentication, addreviews);

router.route('/get-reviews').get(authentication, getReviews);

router.route('/edit-reviews/:reviewId').put(authentication, editReview);


export default router;
