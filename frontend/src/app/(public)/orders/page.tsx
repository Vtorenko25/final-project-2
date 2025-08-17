import React from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";
import HeaderComponent from "@/app/components/header/HeaderComponent";

const UsersPage = () => {
    return (
        <div>
            <HeaderComponent/>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;