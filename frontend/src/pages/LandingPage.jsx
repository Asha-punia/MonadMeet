import "./LandingPage.css";
import heroImg from "../assets/hero.png";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
function LandingPage () {
    const {user} = useContext(AuthContext);
    return (
        <div className="landingPageContainer">
            <Navbar />
            <div className="hero-section">
                <div className="hero-left">
                    <h1>Fast. <span>Secure.</span> Simple.</h1>
                    <p>Join HD video meetings with real-time chat, screen sharing and crystal-clear audio.</p>
                    <Link to={user ? "/dashboard" : "/auth"} className="hero-btn">Start Meeting</Link>
                </div>
                <div className="hero-right">
                    <img className="hero-img" src={heroImg} alt="MeetSync Preview"></img>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;




