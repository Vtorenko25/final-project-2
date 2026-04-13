import {PasswordValidationResult} from "@/app/models/IPasswordValidator";


export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < 4) errors.push("Password must be at least 4 characters long");
    // if (!/[A-Z]/.test(password)) errors.push("Потрібна хоча б одна велика літера");
    // if (!/[a-z]/.test(password)) errors.push("Потрібна хоча б одна мала літера");
    // if (!/[0-9]/.test(password)) errors.push("Потрібна хоча б одна цифра");
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Потрібен хоча б один спеціальний символ");

    return {
        valid: errors.length === 0,
        errors,
    };
};