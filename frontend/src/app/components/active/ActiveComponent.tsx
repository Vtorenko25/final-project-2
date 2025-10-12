'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "./active-component.css";
// import { authService } from '@/app/services/auth.service';

export default function ActiveComponent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        setToken(urlToken);
    }, [searchParams]);

    const handleActivate = async () => {
        if (!token) {
            alert('Токен не знайдено в URL!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        try {
            // Надсилаємо токен і пароль на бекенд
            // await authService.activateAccount(token, password);
            alert('Акаунт активовано успішно!');
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
