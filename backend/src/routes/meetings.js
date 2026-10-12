import { Router } from "express";
import {
    saveMeeting,
    getMeetingByCode
} from "../controllers/meetings.js";

const router = Router();

router.post("/", saveMeeting);
router.get("/:meetingCode", getMeetingByCode);

export default router;
