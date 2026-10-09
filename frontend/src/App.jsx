import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Authentication from "./pages/Authentication.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import VideoMeet from "./pages/VideoMeet.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Features from "./pages/Features.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<Features />} /> 
            <Route path="/auth" element={<Authentication />} />
            <Route
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:url" 
              element={
                <ProtectedRoute>
                  <VideoMeet />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App;
