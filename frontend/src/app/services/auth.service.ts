import { ITokens } from "@/app/models/ITokens";
import { urlBuilder } from "@/app/services/api.service";
import {validateEmail} from "@/app/helpers/emailValidator";

export const authService = {
    signIn: async (email: string, password: string): Promise<ITokens> => {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            throw new Error(emailCheck.errors[0]); // першу помилку
        }

        try {
            const response = await fetch(urlBuilder.authUser(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Невірні дані");
            }

            return await response.json();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    signInManager: async (email: string, password: string): Promise<ITokens> => {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            throw new Error(emailCheck.errors[0]);
        }

        try {
            const response = await fetch(urlBuilder.authManager(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Невірні дані");
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ password, manager_id }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Помилка активації");
            }

            return await response.json();
        } catch (error) {
            console.error("Activate error:", error);
            throw error;
        }
    },
};
