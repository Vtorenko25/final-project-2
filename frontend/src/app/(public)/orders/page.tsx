import React from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";
import LogoComponent from "@/app/components/logo/LogoComponent";

const UsersPage = () => {
    return (
        <div>
            <LogoComponent/>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;