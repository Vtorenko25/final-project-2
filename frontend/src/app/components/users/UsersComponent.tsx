'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IUser } from "@/app/models/IUser";
import { userService } from "@/app/services/user.service";
import "./users-component.css";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const usersPerPage = 25;

    useEffect(() => {
        userService.getAllUsers(page)
            .then((data) => {
                const fetchedUsers = Array.isArray(data.data) ? data.data : data;
                const total = data.total || fetchedUsers.length;
                setUsers(fetchedUsers);
                setTotalUsers(total);
            })
            .catch(err => {
                console.error('Помилка завантаження:', err);
                setUsers([]);
                setTotalUsers(0);
            });
    }, [page]);

    return (
        <div className="users-container">
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
