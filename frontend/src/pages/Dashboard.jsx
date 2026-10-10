import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../components/Navbar.jsx";
export default function dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    let [roomId, setRoomId] = useState("");
    const createMeeting = async () => {
        const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/meetings`,
                { meetingCode: newRoomId },
                { headers: { authorization: token } }
            );

            navigate(`/${newRoomId}`);
        } catch (error) {
            console.error("Failed to save meeting:", error);
            alert("Could not save the meeting. Please try again.");
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