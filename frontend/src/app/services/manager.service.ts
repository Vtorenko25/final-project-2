import { urlBuilder } from "@/app/services/api.service";
import {IManager} from "@/app/models/IManager";

export const managerService = {
    createManager: async (dto: IManager) => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const { accessToken } = JSON.parse(tokensPair);
            const response = await fetch(urlBuilder.createManager(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create comment");
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    },

    getAllManagers: async (page: number): Promise<{ data: IManager[], total: number, page: number, limit: number }> => {
        const tokensPair = localStorage.getItem('tokens');
        if (!tokensPair) throw new Error("No tokens found in localStorage");

        const { accessToken } = JSON.parse(tokensPair);

        const response = await fetch(urlBuilder.getAllManagers(page), {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch managers');
        }

        return await response.json();
    },


};


