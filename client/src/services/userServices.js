const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;


export const fetchUsers = async () => {
    try {
        const response = await fetch(
            `${API_URL}/users`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Fetch Users Error:", error);

        throw error;
    }
};