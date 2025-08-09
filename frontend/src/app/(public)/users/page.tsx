import React from 'react';
import PaginationComponent from "@/components/pagination/PaginationComponent";
import UsersComponent from "@/components/users/UsersComponent";

const UsersPage = () => {
    return (
        <div>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;