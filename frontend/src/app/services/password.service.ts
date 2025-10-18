import { urlBuilder } from "@/app/services/api.service";


export const passwordService = {
    createPassword: async (id: number) => {
        const tokensPair = localStorage.getItem('tokens');
        if (!tokensPair) throw new Error("No tokens found in localStorage");

        const { accessToken } = JSON.parse(tokensPair);

        const response = await fetch(urlBuilder.createPassword(id), {
            method: 'POST',
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
    updatePassword: async (id: number) => {
        const tokensPair = localStorage.getItem('tokens');
        if (!tokensPair) throw new Error("No tokens found in localStorage");

        const { accessToken } = JSON.parse(tokensPair);

        const response = await fetch(urlBuilder.createPassword(id), {
            method: 'PATCH',
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


