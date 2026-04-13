import { urlBuilder } from "@/app/services/api.service";

export const groupService = {
    getAllGroups: async () => {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) throw new Error("No tokens");

        const { accessToken } = JSON.parse(tokens);

        const res = await fetch(urlBuilder.getAllGroups(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch groups");

        return res.json();
    },

    createGroup: async (name: string) => {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) throw new Error("No tokens");
        const { accessToken } = JSON.parse(tokens);

        const res = await fetch(urlBuilder.createGroup(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error("Failed to create group");

        return res.json();
    },

    assignGroupToUser: async (userId: string, name: string) => {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) throw new Error("No tokens");
        const { accessToken } = JSON.parse(tokens);

        const res = await fetch(urlBuilder.assignGroup(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, name }),
        });

        // if (!res.ok) throw new Error("Failed to assign group");

        if (!res.ok) {
            const error = await res.json().catch(() => null);
            console.error("Assign group error response:", error);
            throw new Error(error?.message || "Failed to assign group");
        }
        return res.json();
    }
};