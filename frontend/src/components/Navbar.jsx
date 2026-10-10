import { Link } from "react-router-dom";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import { connectWallet } from "../blockchain/wallet.js";

import "./Navbar.css";

const Navbar = () => {
    const { user, handleLogout} = useContext(AuthContext);
    let [menuOpen, setMenuOpen] = useState(false);
    let [walletAddress, setWalletAddress] = useState("");
    let [walletError, setWalletError] = useState("");
    const handleConnectWallet = async () => {
        setWalletError("");
        try {
            const wallet = await connectWallet();
            setWalletAddress(wallet.address);
        }catch(error) {
            setWalletError(error.message || "Wallet connection failed!");
        }
        
    }
    
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <h1 className="lobby-title">
                        <VideoCameraFrontIcon className="navbar-logo" sx={{
                            fontSize: "2.5rem",
                            color: "#1d4ed8",
                        }}/>
                        <span className="navbar-logo-text">
                            Meet<span className="navbar-logo-highLight">Sync</span>
                        </span>
                    </h1>
                </div>
                <div className="navbar-menu">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/features" className="nav-link">Features</a>
                    {walletAddress ? (
                        <Button className="nav-btn">
                            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                        </Button>
                    ) : (
                        <Button onClick={handleConnectWallet} className="nav-btn">
                            Connect Wallet
                        </Button>
                    )}
                    {user ? (
                        <>
                            <span>{user.name}</span>
                            <Link onClick={handleLogout} className="nav-link">Log out</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="nav-link">Sign In</Link>
                            <Link to="/dashboard" className="nav-btn">Get Started</Link>
                        </>
                    )}
                    
                </div>
                <Button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} disableRipple sx={{
                    color: "#374151",
                    "&:hover": {
                        backgroundColor: "transparent"
                    },
                    minWidth: "auto",
                    padding: "8px",
                }}>
                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </Button>
                {menuOpen && (
                    <div className="mobile-menu">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/features" className="nav-link">Features</a>
                        {walletAddress ? (
                            <Button className="nav-btn">
                                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                            </Button>
                        ) : (
                            <Button onClick={handleConnectWallet} className="nav-btn">
                                Connect Wallet
                            </Button>
                        )}
                        {user ? (
                            <>
                                <Link onClick={handleLogout} className="nav-link">Log out</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/auth" className="nav-link">Sign In</Link>
                                <Link to="/dashboard" className="nav-btn">Get Started</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
            {walletError && (
                <div className="wallet-error" role="alert">
                    <span>{walletError}</span>
                    <button
                        type="button"
                        className="wallet-error-close"
                        onClick={() => setWalletError("")}
                        aria-label="Dismiss wallet error"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>
            )}
        </>
    );
}

export default Navbar;