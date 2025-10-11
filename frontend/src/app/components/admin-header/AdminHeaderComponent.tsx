'use client';

import { useEffect, useState } from 'react';
import './admin-header-component.css';
import { getUserRole } from '@/app/helpers/role';

import { FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AdminHeaderComponent() {
    const [role, setRole] = useState<'admin' | 'manager' | null>(null);
    const router = useRouter();

    useEffect(() => {
        setRole(getUserRole());
    }, []);

    const handleAdminClick = () => {
        router.push('/admin');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="logo-component">
            <div className="logo">Logo</div>
            <div className="logo-component-admin">
                {role && <div className="role">{role}</div>}
                {role === 'admin' && (
                    <button
                        className="button-admin"
                        onClick={handleAdminClick}
                    >
                        <FaUserShield size={18} />
                    </button>
                )}
                <button
                    className="button-exit"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt size={18} />
                </button>
            </div>
        </div>
    );
}
