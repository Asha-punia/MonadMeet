import { Router } from "express";
import { saveMeeting } from "../controllers/meetings.js";
const router = Router();

router.post("/", saveMeeting);

export default router;