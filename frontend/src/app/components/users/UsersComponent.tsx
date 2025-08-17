'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IUser } from "@/app/models/IUser";
import { userService } from "@/app/services/user.service";

import "./users-component.css";
import HeaderComponent from "@/app/components/header/HeaderComponent";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [sortColumn, setSortColumn] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const page = parseInt(searchParams.get('page') || '1', 10);
    const usersPerPage = 25;

    // функція сортування
    const sortData = (data: IUser[], column: string, order: "asc" | "desc") => {
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

    useEffect(() => {
        userService.getAllUsers(page)
            .then((data) => {
                const fetchedUsers = Array.isArray(data.data) ? data.data : data;
                const total = data.total || fetchedUsers.length;
                const sorted = sortData(fetchedUsers, sortColumn, sortOrder);
                setUsers(sorted);
                setTotalUsers(total);
            })
            .catch(err => {
                console.error('Помилка завантаження:', err);
                setUsers([]);
                setTotalUsers(0);
            });
    }, [page, sortColumn, sortOrder]);

    return (
        <div className="users-container">
            {/* передаємо callback для зміни сортування */}
            <HeaderComponent
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortChange={(col, order) => {
                    setSortColumn(col);
                    setSortOrder(order);
                }}
            />

            {users.length > 0 ? (
                users.map((user, index) => (
                    <ul key={user._id}>
                        <li>{totalUsers - ((page - 1) * usersPerPage + index)}</li>
                        <li>{user.name || "null"}</li>
                        <li>{user.surname || "null"}</li>
                        <li>{user.email || "null"}</li>
                        <li>{user.phone || "null"}</li>
                        <li>{user.age || "null"}</li>
                        <li>{user.course || "null"}</li>
                        <li>{user.course_format || "null"}</li>
                        <li>{user.course_type || "null"}</li>
                        <li>{user.status || "in work"}</li>
                        <li>{user.sum || "null"}</li>
                        <li>{user.already_paid || "null"}</li>
                        <li>{user.group || "null"}</li>
                        <li>
                            {user.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "null"}
                        </li>
                        <li>{user.manager || "admin"}</li>
                    </ul>
                ))
            ) : (
                <p>Немає даних</p>
            )}
        </div>
    );
}
