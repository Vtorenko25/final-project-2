'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { urlBuilder } from "@/app/services/api.service";
import { IUser } from "@/app/models/IUser";
import "./users-component.css";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0); // динамічна загальна кількість
    const page = parseInt(searchParams.get('page') || '1', 10);
    const usersPerPage = 25;

    useEffect(() => {
        fetch(urlBuilder.getAllUsers() + `${page}`)
            .then(res => res.json())
            .then(data => {
                let fetchedUsers: IUser[] = [];
                let total = 0;

                if (Array.isArray(data.data)) {
                    fetchedUsers = data.data;
                    total = data.total || fetchedUsers.length; // total може приходити з бекенду
                } else if (Array.isArray(data)) {
                    fetchedUsers = data;
                    total = fetchedUsers.length;
                }

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
                        <li>{user.name ? user.name : "null"}</li>
                        <li>{user.surname ? user.surname : "null"}</li>
                        <li>{user.email ? user.email : "null"}</li>
                        <li>{user.phone ? user.phone : "null"}</li>
                        <li>{user.age ? user.age : "null"}</li>
                        <li>{user.course ? user.course : "null"}</li>
                        <li>{user.course_format ? user.course_format : "null"}</li>
                        <li>{user.course_type ? user.course_type : "null"}</li>
                        <li>{user.status ? user.status : "in work"}</li>
                        <li>{user.sum ? user.sum : "null"}</li>
                        <li>{user.already_paid ? user.already_paid : "null"}</li>
                        <li>{user.group ? user.group : "null"}</li>
                        <li>
                            {user.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "null"}
                        </li>
                        <li>{user.manager ? user.manager : "admin"}</li>
                    </ul>
                ))
            ) : null}
        </div>
    );
}
