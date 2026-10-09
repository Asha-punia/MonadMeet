import { createContext, useState, useEffect} from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

   
    const handleRegister = async (name, username, password) => {
        try{
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, {
                name : name,
                username : username,
                password : password,
            });
            console.log(res.data);
        }catch(err) {
            throw err;
        }
    }
    const handleLogin = async (username, password) => {
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/login`, {
                username : username,
                password : password
            });

            console.log(res.data);
            setUser(res.data.user);
            localStorage.setItem("token", res.data.token);
        }catch(err) {
            throw err;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const getCurrentUser = async() => {
        const token = localStorage.getItem("token");
        if(!token) {
            setLoading(false);
            return
        }
        try {
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
                headers: {
                    authorization: token,
                }
            });
            setUser(res.data.user);
        }catch(e) {
            localStorage.removeItem("token");
            setUser(null);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    const data = {
        user, setUser, handleRegister, handleLogin, getCurrentUser, handleLogout, loading, setLoading,
    }
    console.log("Current user:", user);
    return (
        <AuthContext.Provider value={data} >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;