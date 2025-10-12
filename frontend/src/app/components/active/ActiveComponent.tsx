'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "./active-component.css";
import { authService } from '@/app/services/auth.service';

export default function ActiveComponent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');

        const urlId = searchParams.get('manager_id');


        if (!urlToken || !urlId) {
            alert("Невірний URL: не переданий токен або ID менеджера");
            return;
        }

        const idNumber = Number(urlId);
        if (isNaN(idNumber)) {
            alert("Некоректний ID менеджера");
            return;
        }

        setToken(urlToken);
        setManagerId(idNumber);
    }, [searchParams]);

    const handleActivate = async () => {
        if (!token || managerId === null) {

            alert('Токен або ID менеджера не знайдено!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        try {
            await authService.activateAccount(token, password, managerId);
            console.log(token, managerId, password);

            router.push('/login');
        } catch (error: any) {
            alert(error.message || 'Помилка активації');
        }
    };

    return (
        <div className="active">
            <h2>Активація акаунта</h2>

            <span>Пароль</span>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть пароль"
                type="password"
            />

            <span>Підтвердіть пароль</span>
            <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Підтвердіть пароль"
                type="password"
            />

            <button onClick={handleActivate}>ACTIVATE</button>
        </div>
    );
}
