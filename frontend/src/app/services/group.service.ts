import { urlBuilder } from "@/app/services/api.service";

export const groupService = {
    getAllGroups: async () => {
        try {
            const tokensPair = localStorage.getItem("tokens");
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const { accessToken } = JSON.parse(tokensPair);

            const response = await fetch(urlBuilder.getAllGroups(), {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch groups");
            }

            return await response.json(); // масив груп
        } catch (error) {
            console.error("Error fetching groups:", error);
            throw error;
        }
    },

    createGroup: async (name: string) => {
        try {
            const tokensPair = localStorage.getItem("tokens");
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const { accessToken } = JSON.parse(tokensPair);

            const response = await fetch(urlBuilder.createGroup(), {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create group");
            }

            return await response.json(); // нова група
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    },

};
