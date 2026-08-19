
const API_URL = "http://localhost:3000/api/auth";

export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        
        headers: {
            "Content-Type" : "application/json",
        },

        body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
};


export const login = async (userData) => {

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(userData),
    });

    const data = await response.json();

    return data;
};


export const logout = async () => {

    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    return data;
};


export const getCurrentUser = async () => {

    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",

    });

    const data = await response.json();

    return data;
};

export const updateProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
    });

    return response.json();
};


export const updateProfilePicture = async (file) => {
    try {
        const formData = new FormData();

        formData.append("profilePic", file);

        const response = await fetch(
            "/api/auth/profile/picture",
            {
                method: "PUT",
                credentials: "include",
                body: formData,
            }
        );

        return await response.json();

    } catch (error) {
        console.error("Update Profile Picture Error:", error);

        return {
            success: false,
            message: "Failed to update profile picture",
        };
    }
};