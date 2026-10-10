import { Meeting } from "../models/meeting.js";
import { User } from "../models/user.js";

export const saveMeeting = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid or expired token."
            });
        }

        const { meetingCode } = req.body;

        if (!meetingCode?.trim()) {
            return res.status(400).json({
                message: "Meeting code is required."
            });
        }

        const meeting = await Meeting.create({
            userId: user._id.toString(),
            meetingCode: meetingCode.trim()
        });

        return res.status(201).json({
            message: "Meeting saved successfully.",
            meeting
        });
    } catch (error) {
        console.error("Failed to save meeting:", error);

        return res.status(500).json({
            message: "Failed to save meeting."
        });
    }
};