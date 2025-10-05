'use client';

import { useEffect, useState } from 'react';

import './logo-component.css';
import {getUserRole} from "@/app/helpers/role";

export default function LogoComponent() {
    const [role, setRole] = useState<'admin' | 'manager' | null>(null);

    useEffect(() => {
        setRole(getUserRole());
    }, []);

    return (
        <div className="logo-component">
            <div>Logo</div>
            <div>
                {role && <div>{role}</div>}
                {role === 'admin' && (
                    <button title="Адмін панель">
                        Admin
                    </button>
                )}
                <button title="Вихід">
                    Exit
                </button>
            </div>
        </div>
    );
}
