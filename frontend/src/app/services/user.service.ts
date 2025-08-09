import {IUser} from "@/app/models/IUser";
import {urlBuilder} from "@/app/services/api.service";

export const userService = {
    getAllUsers: async (): Promise<IUser[]> => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) {
                throw new Error("No tokens found in localStorage");
            }

            const { accessToken } = JSON.parse(tokensPair);

            const response = await fetch(urlBuilder.getAllUsers(), {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch users');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },
};
