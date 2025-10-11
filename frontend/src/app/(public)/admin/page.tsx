import React from 'react';
import AdminHeaderComponent from "@/app/components/admin-header/AdminHeaderComponent";
import AdminComponent from "@/app/components/admin/AdminComponent";


const AdminPage = () => {
    return (
        <div>
            <AdminHeaderComponent/>
            <AdminComponent/>
        </div>
    );
};

export default AdminPage;