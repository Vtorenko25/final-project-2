// import React from 'react';
// import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";
// import AdminComponent from "@/app/components/admin/AdminComponent";
//
//
// const AdminPage = () => {
//     return (
//         <div>
//             <AdminHeaderComponent/>
//             <AdminComponent/>
//         </div>
//     );
// };
//
// export default AdminPage;

'use client';

import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";
import AdminComponent from "@/app/components/admin/AdminComponent";
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";


const AdminPage = () => {
    return (
        <ProtectedRoute>
            <div>
                <AdminHeaderComponent/>
                <AdminComponent/>
            </div>
        </ProtectedRoute>
    );
};

export default AdminPage;