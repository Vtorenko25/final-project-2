'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import { authService } from '@/app/services/auth.service';

export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const tokens = await authService.signIn(email, password);
            localStorage.setItem('tokens', JSON.stringify(tokens));
            router.push('/users');
        } catch (error: any) {
            alert(error.message || 'Помилка авторизації');
        }
    };

    return (
        <div className="login">
            <span>Email</span>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <span>Password</span>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />
            <button onClick={handleLogin}>LOGIN</button>
        </div>
    );
}
