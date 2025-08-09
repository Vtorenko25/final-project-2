'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {urlBuilder} from "@/app/services/api.service";

interface IUser {
    _id: string;
    name: string;
    email: string;
}

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        fetch(urlBuilder.getAllUsers()+`${page}`)
            .then(res => res.json())
            .then(data => {
                // якщо бекенд повертає { data: [...] }
                if (Array.isArray(data.data)) {
                    setUsers(data.data);
                }
                // якщо бекенд повертає просто масив
                else if (Array.isArray(data)) {
                    setUsers(data);
                }
                // якщо формат невідомий
                else {
                    setUsers([]);
                }
            })
            .catch(err => {
                console.error('Помилка завантаження:', err);
                setUsers([]);
            });
    }, [page]);

    return (
        <div>
            <h1>Список користувачів</h1>
            <ul>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <li key={user._id}>
                            {(page - 1) * 25 + index + 1}. {user.email} — {user.name}
                        </li>
                    ))
                ) : (
                    <li>Користувачів не знайдено</li>
                )}
            </ul>
        </div>
    );
}
