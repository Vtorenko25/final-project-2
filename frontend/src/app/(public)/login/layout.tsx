import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login Page',
};

type Props = { children: React.ReactNode };
const LoginLayout = ({ children }: Props) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default LoginLayout;