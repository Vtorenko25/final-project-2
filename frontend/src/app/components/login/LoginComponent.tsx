import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import { authService } from '@/app/services/auth.service';
import { validatePassword } from '@/app/helpers/passwordValidator';

export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setError('');

        const result = validatePassword(password);

        if (!result.valid) {
            setError(result.errors.join(', '));
            return;
        }

        try {
            let tokens;

            if (email === 'admin@gmail.com') {
                tokens = await authService.signIn(email, password);
            } else {
                tokens = await authService.signInManager(email, password);
            }

            localStorage.setItem('tokens', JSON.stringify(tokens));
            router.push('/orders');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="login">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <span>Password</span>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleLogin}>LOGIN</button>
        </div>
    );
}
