'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "./active-component.css";
import { authService } from '@/app/services/auth.service';
import { validatePassword } from '@/app/helpers/passwordValidator';

export default function ActiveComponent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<number | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [touched, setTouched] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlId = searchParams.get('manager_id');

        if (!urlToken || !urlId) {
            console.log("Невірний URL: не переданий токен або ID менеджера");
            return;
        }

        const idNumber = Number(urlId);
        if (isNaN(idNumber)) {
            console.log("Некоректний ID менеджера");
            return;
        }

        setToken(urlToken);
        setManagerId(idNumber);
    }, [searchParams]);

    const handleBlur = () => {
        const result = validatePassword(password);
        setErrors(result.errors);
        setTouched(true);
    };

    const handleActivate = async () => {
        if (!token || managerId === null) {
            console.log('Токен або ID менеджера не знайдено!');
            return;
        }

        if (password !== confirmPassword) {
            console.log('Паролі не співпадають!');
            return;
        }

        const result = validatePassword(password);
        if (!result.valid) {
            console.log("Пароль не відповідає вимогам:\n" + result.errors.join("\n"));
            return;
        }

        try {
            await authService.activateAccount(token, password, managerId);
            router.push('/login');
        } catch (error: any) {
            console.log(error.message || 'Помилка активації');
        }
    };

    return (
        <div className="active">
            <h2>Активація акаунта</h2>

            <label>Пароль</label>
            <input
                type="password"
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleBlur}
            />
            {touched && errors.length > 0 && (
                <ul className="error-list">
                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
            )}

            <label>Підтвердіть пароль</label>
            <input
                type="password"
                placeholder="Підтвердіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
            />
            {confirmPassword && password !== confirmPassword && touched && (
                <p className="error">Паролі не співпадають</p>
            )}

            <button
                onClick={handleActivate}
                disabled={errors.length > 0 || password !== confirmPassword}
            >
                ACTIVATE
            </button>
        </div>
    );
}

