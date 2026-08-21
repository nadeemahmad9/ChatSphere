import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login as loginService, logout as logoutService, updateProfile as updateProfileService, updateProfilePicture as updateProfilePictureService, } from "../services/authService";
import { socket } from "../socket/socket";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const navigate = useNavigate();

    const checkAuth = async () => {

        try {
            const data = await getCurrentUser();
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }

        } catch (error) {
            console.error(error);

            setUser(null);
            setIsAuthenticated(false);
        }
        finally {
            setLoading(false)
        }
    }

    const login = async (userData) => {
        try {
            const data = await loginService(userData);
            if (!data.success) {
                return data;
            }

            await checkAuth();


            return {
                success: true,
                message: data.message,
            }
        } catch (error) {
            console.error(error);
            setUser(null);
            setIsAuthenticated(false);
            return {
                success: false,
                message: "Something went wrong"
            }

        }
    }

    const logout = async () => {
        try {
            if (socket.connected) {
                socket.disconnect();
            }

            const data = await logoutService();

            console.log("LOGOUT RESPONSE:", data);

            if (data.success) {
                setUser(null);
                setIsAuthenticated(false);
                setOnlineUsers([]);

                console.log("BEFORE NAVIGATE:", {
                    user: null,
                    isAuthenticated: false,
                });

                navigate("/", { replace: true });
            }

            return data;

        } catch (error) {
            console.error("Logout Error:", error);

            return {
                success: false,
                message: "Logout failed",
            };
        }
    };


    const updateProfile = async (profileData) => {
        try {
            const data = await updateProfileService(profileData);

            if (!data.success) {
                return data;
            }

            // Context ke current user ko immediately update karo
            setUser(data.user);

            return data;

        } catch (error) {
            console.error("Update Profile Error:", error);

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    };

    const updateProfilePicture = async (file) => {
        try {
            const data = await updateProfilePictureService(file);

            if (!data.success) {
                return data;
            }

            // Context ke current user ko immediately update karo
            setUser(data.user);

            return data;

        } catch (error) {
            console.error("Update Profile Picture Error:", error);

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    };

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            console.log(
                "Browser notifications are not supported."
            );

            return;
        }

        if (Notification.permission === "default") {
            try {
                const permission =
                    await Notification.requestPermission();

                console.log(
                    "Notification permission:",
                    permission
                );
            } catch (error) {
                console.error(
                    "Notification Permission Error:",
                    error
                );
            }
        }
    };

    useEffect(() => {
        checkAuth()
        requestNotificationPermission();
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                </div>
            </div>
        );
    }
    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                checkAuth,
                login,
                logout,
                updateProfile,
                updateProfilePicture,
            }}
        >
            {children}

        </AuthContext.Provider>
    )
}