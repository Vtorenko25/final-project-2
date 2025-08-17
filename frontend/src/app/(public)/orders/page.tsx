import React from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";


const UsersPage = () => {
    return (
        <div>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;