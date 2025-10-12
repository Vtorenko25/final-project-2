import {ITokens} from "@/app/models/ITokens";
import {urlBuilder} from "@/app/services/api.service";

export const authService = {
    signIn: async (email: string, password: string): Promise<ITokens> => {
        try {
            const response = await fetch(urlBuilder.authUser(), {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Невірні дані');
            }

            return await response.json();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    activateAccount: async (token: string, password: string, manager_id: number) => {
        try {
            const response = await fetch(urlBuilder.activateAccount(manager_id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password, manager_id })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Помилка активації');
            }

            return await response.json();
        } catch (error) {
            console.error("Activate error:", error);
            throw error;
        }
    },
}