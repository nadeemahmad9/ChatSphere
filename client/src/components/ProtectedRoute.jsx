import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {

    const { loading, isAuthenticated } = useContext(AuthContext);

    console.log("🔥 PROTECTED ROUTE RENDERED", {
        loading,
        isAuthenticated,
        path: window.location.pathname,
        children,
    })

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        console.log("🚨 PROTECTED ROUTE REDIRECTING TO LOGIN");

        return <Navigate to="/login" replace />;
    }

    return children;
};