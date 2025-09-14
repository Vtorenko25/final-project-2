import React from 'react';
import PaginationComponent from "@/app/components/pagination/PaginationComponent";
import UsersComponent from "@/app/components/users/UsersComponent";
import LogoComponent from "@/app/components/logo/LogoComponent";
import FilterComponent from "@/app/components/filter/FilterComponent";


const UsersPage = () => {
    return (
        <div>
            <LogoComponent/>
            <FilterComponent/>
            <UsersComponent/>
            <PaginationComponent/>
        </div>
    );
};

export default UsersPage;