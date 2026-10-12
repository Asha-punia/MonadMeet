import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../components/Navbar.jsx";
import {createBlockchainMeeting} from "../blockchain/meetingContract.js";
export default function dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    let [roomId, setRoomId] = useState("");

    
    const createMeeting = async () => {
        const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();

        try {
            console.log("Step 1: Connecting wallet and creating blockchain meeting...");

            const blockchainMeeting = await createBlockchainMeeting();

            console.log("Step 2: Blockchain meeting created:", blockchainMeeting);

            const API_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
                ? "http://localhost:8000"
                : (import.meta.env.VITE_API_URL || "https://monadmeet-backend.onrender.com");

            const token = localStorage.getItem("token");

            console.log("Step 3: Saving meeting to backend:", API_URL);

            await axios.post(
                `${API_URL}/api/v1/meetings`,
                {
                    meetingCode: newRoomId,
                    blockchainMeetingId: blockchainMeeting.meetingId,
                    transactionHash: blockchainMeeting.transactionHash,
                    walletAddress: blockchainMeeting.walletAddress,
                },
                {
                    headers: { authorization: token },
                }
            );

            console.log("Step 4: Meeting saved. Navigating to room:", newRoomId);
            navigate(`/${newRoomId}`);
        } catch (error) {
            console.error("Create meeting failed:", error);
            console.error("Error details:", error?.shortMessage || error?.response?.data || error?.message);

            alert(
                error?.shortMessage ||
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Could not create the meeting. Check the browser console."
            );
        }
    };

    const joinMeeting = () => {
        if (!roomId.trim()) {
            alert("Please enter a meeting ID");
            return;
        }

        navigate(`/${roomId.trim()}`);
    }
    return (
        <div className="dashboardContainer">
            <Navbar />
            <div className="dashboard-main">
                <h1> Welcome back, {user.name}! </h1>
                <div className="meeting-options">
                    <div className="meeting-card">
                        <h2>
                            Create a Meeting
                        </h2>
                        <p>
                            Start a new meeting and invite others to join.
                        </p>
                        <button onClick={createMeeting}>Create Meeting</button>
                    </div>
                    <div className="meeting-card">
                        <h2>
                            Join a Meeting
                        </h2>
                        <p>
                            Have a meeting code? Enter it below to join.
                        </p>
                        <div className="join-meeting">
                            <input placeholder="Enter meeting code" value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
                            <button onClick={joinMeeting}>Join Meeting</button>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    );
}