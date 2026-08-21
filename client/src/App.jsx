console.log("🚀 NEW APP.JSX LOADED");

import { useEffect } from "react";
import { socket } from "./socket/socket";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthLanding } from "./pages/AuthLanding";

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

  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-red-500 flex items-center justify-center text-white text-4xl">
            AUTH LANDING ROUTE
          </div>
        }
      />

      {/* Mobile Login */}
      <Route
        path="/mobile-login"
        element={
          <div>Mobile Login Coming Soon</div>
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Home */}
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