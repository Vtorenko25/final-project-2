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


// 'use client';
//
// import React, { useState } from 'react';
// import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";
// import UsersComponent from "@/app/components/users/UsersComponent";
// import PaginationComponent from "@/app/components/pagination/PaginationComponent";
//
// const UsersPage = () => {
//     const [totalUsers, setTotalUsers] = useState(0);
//     const usersPerPage = 25;
//
//     return (
//         <div>
//             <AdminHeaderComponent />
//             <UsersComponent setTotalUsers={setTotalUsers} usersPerPage={usersPerPage} />
//             <PaginationComponent totalItems={totalUsers} itemsPerPage={usersPerPage} />
//         </div>
//     );
// };
//
// export default UsersPage;
