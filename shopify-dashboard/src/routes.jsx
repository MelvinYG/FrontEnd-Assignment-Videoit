import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/" 
                    element = {
                            <Auth />
                        }
                />
                <Route
                    path="/auth/callback"
                    element = {
                            <AuthCallback />
                            } 
                />
                <Route 
                    path="/dashboard" 
                    element = { 
                            <Dashboard />
                            } 
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
