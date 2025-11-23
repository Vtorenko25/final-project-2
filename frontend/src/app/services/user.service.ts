import { urlBuilder } from "@/app/services/api.service";
import {IUser, IUserUpdateDto} from "@/app/models/IUser";

export const userService = {
    getAllUsers: async (page: number):Promise<{ data: IUser[]; total: number }> => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const stored = JSON.parse(tokensPair);
            const accessToken = stored.tokens?.accessToken;
            if (!accessToken) throw new Error("Access token not found");

            const response = await fetch(urlBuilder.getAllUsers(page), {
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

    getUsersStatistic: async () => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const stored = JSON.parse(tokensPair);
            const accessToken = stored.tokens?.accessToken;
            if (!accessToken) throw new Error("Access token not found");

            const response = await fetch(urlBuilder.getUsersStatistic(), {
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

    getManagerStatistic: async (email:string) => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const stored = JSON.parse(tokensPair);
            const accessToken = stored.tokens?.accessToken;
            if (!accessToken) throw new Error("Access token not found");

            const response = await fetch(urlBuilder.getManagerStatistic(email), {
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

    updateUserById: async (id: string, dto: Partial<IUserUpdateDto>) => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const stored = JSON.parse(tokensPair);
            const accessToken = stored.tokens?.accessToken;
            if (!accessToken) throw new Error("Access token not found");

            const response = await fetch(urlBuilder.updateUserById(id), {
                method: "PUT",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update user");
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            throw error;
        }
    },
};





