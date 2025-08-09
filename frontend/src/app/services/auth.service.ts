import {ITokens} from "@/app/models/ITokens";
import {urlBuilder} from "@/app/services/api.service";

export const authService = {
    signIn: async (email: string, password: string): Promise<ITokens> => {
        try {
            const response = await fetch(urlBuilder.authUser(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
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
};