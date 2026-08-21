import { useContext, useEffect } from "react";
import { socket } from "./socket/socket";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthLanding } from "./pages/AuthLanding";

import { AuthContext } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

function App() {

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Client Socket ID:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { user, loading, isAuthenticated } =
    useContext(AuthContext);

  return (
    <Routes>

      {/* =========================
                AUTH LANDING
            ========================= */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthLanding />
          </PublicRoute>
        }
      />

      {/* =========================
                MOBILE LOGIN
            ========================= */}
      <Route
        path="/mobile-login"
        element={
          <div>
            Mobile Login Coming Soon
          </div>
        }
      />

      {/* =========================
                LOGIN
            ========================= */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* =========================
                REGISTER
            ========================= */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* =========================
                PROTECTED HOME
            ========================= */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;