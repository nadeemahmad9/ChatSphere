import { useContext, useEffect } from "react";
import { socket } from "./socket/socket";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AuthLanding } from "./pages/AuthLanding";

function App() {

  useEffect(() => {

    socket.connect();
    // socket.emit("hello", "Hello Server");
    socket.on("connect", (data) => {
      console.log("Client Socket ID:", socket.id);

      // console.log(data);

    });
    return () => {

      socket.disconnect();

    };

  }, []);

  const { user, loading, isAuthenticated } = useContext(AuthContext)
  // console.log("USER:", user);
  // console.log("Loading:", loading);
  // console.log("Authenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= PUBLIC LANDING PAGE ========================= */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthLanding />
            </PublicRoute>
          }
        />

        {/* ========================= Mobile Login ========================= */}

        <Route
          path="/mobile-login"
          element={<div>Mobile Login Coming Soon</div>}
        />
        {/* ========================= LOGIN ========================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* ========================= REGISTER ========================= */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        {/* ========================= PROTECTED HOME ========================= */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );

}

export default App;