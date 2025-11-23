import {IEmailValidator} from "@/app/models/IEmailValidator";


export const validateEmail = (email: string): IEmailValidator => {
    const errors: string[] = [];
    if (!email) {
        errors.push("Email не може бути порожнім");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Невірний формат email");
        }

    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
