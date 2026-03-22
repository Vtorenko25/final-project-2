'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuth } from '@/app/helpers/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuth()) {
            router.replace('/login');
        }
    }, []);

    return <>{children}</>;
}