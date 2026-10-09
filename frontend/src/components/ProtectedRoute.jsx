import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ProtectedRoute.css";
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from "@mui/material/IconButton";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    if(loading) {
        return (
            <div className="loading-page">
                <IconButton><RefreshIcon /></IconButton>
                <b>Loading...</b>
            </div>
        );
    }
    if(!user) {
        return <Navigate to="/auth" replace />
    }

    return children;
}

export default ProtectedRoute;