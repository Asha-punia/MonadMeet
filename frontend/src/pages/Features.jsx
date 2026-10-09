import Navbar from "../components/Navbar";
import "./Features.css";
import heroImg from "../assets/hero.png";
import authImg from "../assets/auth.png";
import createMeetingImg from "../assets/createMeeting.png";
import joinMeetingImg from "../assets/joinMeeting.png"
import { Link } from "react-router-dom";
import inviteImg from "../assets/inviteImg.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function Features() {
    const { user } = useContext(AuthContext);
    return (
        <div className="features-container">
            <Navbar /> 
            <div className="features-main">
                <h1>
                    Everything you need for simple meetings
                </h1>
                <p>
                    MeetSync makes it easy to create, join, and share video meetings with others.
                </p>
                <div className="features-grid">
                    <div className="feature-section">
                        <div className="feature-content">
                            <h2>Video Meetings</h2>
                            <p>Have real-time video and audio meetings with other participants.</p>
                        </div>
                        <div className="feature-image">
                            <img
                                src={heroImg}
                                alt="meetsync video meeting"
                            />
                        </div>
                    </div>
                    <div className="feature-section">
                        <div className="feature-image">
                            <img
                                src={createMeetingImg}
                                alt="meetsync create meeting"
                            />
                        </div>
                        <div className="feature-content">
                            <h2>Create Meetings</h2>
                            <p>Create a meeting and get a meeting link that you can share with others.</p>
                        </div>
                    </div>
                    <div className="feature-section">
                        <div className="feature-content">
                            <h2>Join Meetings</h2>
                            <p>Join an existing meeting using a meeting code or shared meeting link.</p>
                        </div>
                        <div className="feature-image">
                            <img
                                src={joinMeetingImg}
                                alt="meetsync join meeting"
                            />
                        </div>
                    </div>
                    <div className="feature-section">
                        <div className="feature-image">
                            <img
                                src={inviteImg}
                                alt="meetsync invite meeting popup"
                            />
                        </div>
                        <div className="feature-content">
                            <h2>Easy Invitations</h2>
                            <p>Copy your meeting link directly from the call and easily invite other participants.</p>
                        </div>
                    </div>
                    <div className="feature-section">
                        <div className="feature-content">
                            <h2>Secure Authentication</h2>
                            <p>Create an account, securely log in, and access protected areas of MeetSync.</p>
                        </div>
                        <div className="feature-image">
                            <img
                                src={authImg}
                                alt="meetsync authentication"
                            />
                        </div>
                    </div>
                    <div className="feature-section">
                        <div className="feature-content">
                            <h2>Responsive Design</h2>
                            <p>Use MeetSync comfortably across desktop and mobile screen sizes.</p>
                        </div>
                    </div>
                </div>
                <div className="features-cta">
                    <h2>Ready to start a meeting?</h2>
                    <p>Create a meeting and invite your friends, teammates, or colleagues.</p>
                    <Link to={user ? "/dashboard" : "/auth"} className="hero-btn">Start Meeting</Link>
                </div>
            </div>
        </div>
    );
}