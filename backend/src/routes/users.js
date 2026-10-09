import Router from "express";
const router = Router();
import { login, register, getCurrentUser } from "../controllers/users.js";

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/me").get(getCurrentUser);

export default router;