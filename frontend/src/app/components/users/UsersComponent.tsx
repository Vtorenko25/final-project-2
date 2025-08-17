'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IUser } from "@/app/models/IUser";
import { userService } from "@/app/services/user.service";

import "./users-component.css";
import HeaderComponent from "@/app/components/header/HeaderComponent";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [sortColumn, setSortColumn] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const page = parseInt(searchParams.get('page') || '1', 10);
    const usersPerPage = 25;

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
        userService.getAllUsers(1)
            .then((data) => {
                const total = data.total || data.data?.length || 0;
                setTotalUsers(total);

                const totalPages = Math.ceil(total / usersPerPage);
                const serverPage = totalPages - page + 1;

                userService.getAllUsers(serverPage)
                    .then((data) => {
                        const fetchedUsers = Array.isArray(data.data) ? data.data : data;
                        const sorted = sortData(fetchedUsers, sortColumn, sortOrder);
                        setUsers(sorted);
                    });
            })
            .catch(err => {
                console.error('Помилка завантаження:', err);
                setUsers([]);
                setTotalUsers(0);
            });
    }, [page, sortColumn, sortOrder]);

    const handleSortChange = (column: string, order: "asc" | "desc") => {
        setSortColumn(column);
        setSortOrder(order);

        const params = new URLSearchParams(searchParams.toString());
        params.set("order", column);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    return (
        <div className="users-container">
            <HeaderComponent
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            {users.length > 0 ? (
                users.map((user) => (
                    <ul key={user._id}>
                        <li>{user.id || "null"}</li>
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
