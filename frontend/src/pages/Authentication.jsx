import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import "./Authentication.css"
import {useState, useContext} from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Navbar from "../components/Navbar.jsx";

function Authentication() {

    let [name, setName] = useState("");
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [formType, setFormType] = useState(0); // login = 0 signup = 1
    let [showSuccess, setShowSuccess] = useState(false);
    let [successMessage, setSuccessMessage] = useState("");
    const {handleLogin, handleRegister} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuth = async () => {
        try{
            if(formType == 0) {
                await handleLogin(username, password);
                setShowSuccess(true);
                setSuccessMessage(`Welcome back, ${username}!`);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            }else if (formType == 1) {
                await handleRegister(name, username, password);
                setShowSuccess(true);
                setSuccessMessage("Account created successfully!");
                setTimeout(() => {
                    setFormType(0);
                }, 1000);
            }

        }catch(err) {
            console.log(err);
        }
    }


    const handleName = (event) => {
        setName(event.target.value)
    }
    const handleUserame = (event) => {
        setUsername(event.target.value)
    }
    const handlePassword = (event) => {
        setPassword(event.target.value)
    }
    const handleBtn = () => {
        setFormType((prevFormType) => {
            if(prevFormType == 0) {
                return 1;
            }else {
                return 0;
            }
        });
    }
    return (
        <div className='auth-page-container'>
        <Snackbar
            open={showSuccess}
            autoHideDuration={1000}
            onClose={() => setShowSuccess(false)}
        >
            <Alert
                onClose={() => setShowSuccess(false)}
                severity='success'
                variant='filled'
                sx={{width: "100%"}}
            >
                { successMessage }
            </Alert>
        </Snackbar>
        <Navbar />
        <div className='authenticationContainer'>
            <div className='authentication-card'>
                <h1 className="lobby-title">
                    <VideoCameraFrontIcon className="logo"/>
                    <span className="logo-text">
                        Meet<span className="logo-highLight">Sync</span>
                    </span>
                </h1>
                <div className='auth-toggle'>
                    <Button variant={formType == 0 ? "contained" : ""} onClick={handleBtn}>Log In</Button>
                    <Button variant={formType == 1 ? "contained" : ""} onClick={handleBtn}>Sign Up</Button>
                </div>
                
                <form className='auth-form'>
                    {formType == 1 ? <><TextField id="Name" label="Name" variant="outlined" value={name} onChange={handleName} fullWidth required/> </> : <></>}
                    <TextField id="Username" label="Username" variant="outlined" value={username} onChange={handleUserame} fullWidth required/>
                    <TextField id="Password" label="Password" type="password" autoComplete="current-password" value={password} onChange={handlePassword} fullWidth required/>
                    <Button variant="contained" fullWidth onClick={handleAuth}>{formType == 0 ? "Sign In" : "Create Account"}</Button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default Authentication;