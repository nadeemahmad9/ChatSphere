export const fetchUsers = async () => {
    try {
        // API call
        const response = await fetch(
            "/api/auth/users",
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