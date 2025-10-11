import React from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";
import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";

const UsersPage = () => {
    return (
        <div>
            <AdminHeaderComponent/>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;