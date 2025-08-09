'use client';

import { useEffect, useState } from 'react';
import { IUser } from '@/app/models/IUser';
import {userService} from "@/app/services/user.service";



export default function UsersComponent() {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error('Помилка при завантаженні користувачів:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Список користувачів</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={user._id}>
                        {index + 1}.  {user.email} {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
