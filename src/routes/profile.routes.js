import { Router } from "express";
import { addProfile, updateProfile,getProfile } from "../controllers/profile.controller.js";
import authentication from "../middlewares/auth.middlewares.js";
import multerConfig from "../middlewares/multer.middlewares.js";
const router = Router();
router.route('/add-profile').post(authentication,multerConfig.upload.single('imgPah'), addProfile);

router.route('/edit-profile').put(authentication,multerConfig.upload.single('imgPah'), updateProfile);

router.route('/get-profile').get(authentication, getProfile);



export default router;