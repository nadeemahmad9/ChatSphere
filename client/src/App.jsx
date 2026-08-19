import { useContext, useEffect } from "react";
import { socket } from "./socket/socket";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

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
  console.log("USER:", user);
  console.log("Loading:", loading);
  console.log("Authenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );

}

export default App;