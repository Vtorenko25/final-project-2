import { IUser } from "@/app/models/IUser";

export const sortData = (data: IUser[], column: string, order: "asc" | "desc") => {
    const sorted = [...data].sort((a, b) => {
        const valA = a[column as keyof IUser] ?? "";
        const valB = b[column as keyof IUser] ?? "";

        if (typeof valA === "number" && typeof valB === "number") {
            return order === "asc" ? valA - valB : valB - valA;
        }

        return order === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });
    return sorted;
};