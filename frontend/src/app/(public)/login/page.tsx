'use client';

import LoginComponents from "@/app/components/login/LoginComponent";

import "./login-page.css";
import PublicRoute from "@/app/components/publicRoute/PublicRoute";

const LoginPage = () => {
    return (
        <PublicRoute>
            <div className="login-page">
                <LoginComponents/>
            </div>
        </PublicRoute>
    );
};

export default LoginPage;