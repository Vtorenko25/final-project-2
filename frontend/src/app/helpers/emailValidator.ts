import {IEmailValidator} from "@/app/models/IEmailValidator";


export const validateEmail = (email: string): IEmailValidator => {
    const errors: string[] = [];
    if (!email) {
        errors.push("Email cannot be empty");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Invalid email format");
        }

    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
