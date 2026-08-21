import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {

    const { loading, isAuthenticated } = useContext(AuthContext);

    console.log("PROTECTED ROUTE:", {
        loading,
        isAuthenticated,
        path: window.location.pathname,
    });

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};