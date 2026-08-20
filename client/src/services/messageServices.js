const API_URL = `${import.meta.env.VITE_API_URL}/api/message`;

export const fetchMessages = async (receiverId) => {
    try {
        const response = await fetch(`${API_URL}/${receiverId}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data  = await response.json();
        return data;

    } catch (error) {
        console.error("Get Messages Error:", error);

        return {
            success: false,
            message: "Something went wrong",
    }
}
}


export const sendMessageApi = async (receiverId, messageData) => {
    try {
        const response = await fetch(
            `${API_URL}/${receiverId}`,
            {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(messageData),
            }
        );

        const data = await response.json();
        console.log(
    "========== SEND MESSAGE RESPONSE =========="
);

console.log("Full response:", data);
console.log("Message:", data.message);
console.log("Message ID:", data.message?._id);
console.log("Reply To:", data.message?.replyTo);


        return data;

    } catch (error) {

        console.error("Send Message Error:", error);

        return {
            success: false,
            message: "Something went wrong",
        };
    }
};

export const markMessagesAsSeenApi = async (senderId)=>{
    try {
        const response = await fetch(`${API_URL}/seen/${senderId}`,
            {
                method: "PATCH",
                credentials: "include",
            }
        )

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Mark Messages Seen Error:", error); 
        return { 
            success: false, 
            message: "Something went wrong",
    }
}
}

export const deleteMessageForEveryone = async (
    messageId
) => {
    try {
        const response = await fetch(
            `${API_URL}/delete/${messageId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        return await response.json();

    } catch (error) {
        console.error(
            "Delete Message Error:",
            error
        );

        return {
            success: false,
            message: "Failed to delete message",
        };
    }
};

export const deleteMessageForMe = async (messageId) => {
    try {
        const response = await fetch(
            `${API_URL}/delete-for-me/${messageId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        const data = await response.json();

return {
            ...data,
            status: response.status,
        };
        

    } catch (error) {
        console.error(
            "Delete Message For Me Error:",
            error
        );

        return {
            success: false,
            message: "Failed to delete message",
        };
    }
};

//======================
    // react to message
    //=======================

export const reactToMessageApi = async (messageId, emoji) => {
        try {
            const response = await fetch(
                `${API_URL}/react/${messageId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emoji,
                    }),
                }
            );

            return await response.json();

        } catch (error) {
            console.error(
                "React To Message API Error:",
                error
            );

            return {
                success: false,
                message: "Failed to react to message",
            };
        }
    };