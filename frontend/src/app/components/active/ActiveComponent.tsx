'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./active-component.css"
import { authService } from '@/app/services/auth.service';

export default function ActiveComponent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const tokens = await authService.signIn(password, confirmPassword);
            localStorage.setItem('tokens', JSON.stringify(tokens));
            router.push('/login');
        } catch (error: any) {
            alert(error.message || 'Помилка реєстрації');
        }
    };

    return (
        <div className="active">
            <span>Password</span>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />
            <span>Confirm Password</span>
            <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
            />
            <button onClick={handleLogin}>ACTIVATE</button>
        </div>
    );
}
