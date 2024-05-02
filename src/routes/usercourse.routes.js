import { Router } from "express";
import { usercourse , getCourse, editcourse} from "../controllers/usercourse.controller.js";
import authentication from "../middlewares/auth.middlewares.js";
const router = Router();
router.route('/user-course').post(authentication, usercourse);

router.route('/get-course').get(authentication,getCourse);

router.route('/edit-course/:usercourseId').put(authentication, editcourse);


export default router;