'use client';

import React, { useState } from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";
import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";


const UsersPage = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const usersPerPage = 25;

    return (
        <ProtectedRoute>
            <div>
                <AdminHeaderComponent/>
                <UsersComponent setTotalUsers={setTotalUsers} usersPerPage={usersPerPage} />
                <PaginationComponent totalItems={totalUsers} itemsPerPage={usersPerPage} />
            </div>
        </ProtectedRoute>
    );
};

export default UsersPage;