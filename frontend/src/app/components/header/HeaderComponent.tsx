// 'use client';
//
// import { useState, useEffect } from "react";
// import "./header-component.css";
// import { headerColumns } from "@/app/constans/header.columns";
// import {HeaderProps} from "@/app/models/IHeaderProps";
//
//
//
// const columns = headerColumns;
//
// export default function HeaderComponent({ sortColumn, sortOrder, onSortChange }: HeaderProps) {
//     const [currentCol, setCurrentCol] = useState(sortColumn);
//     const [currentOrder, setCurrentOrder] = useState<"asc" | "desc">(sortOrder);
//
//     useEffect(() => {
//         setCurrentCol(sortColumn);
//         setCurrentOrder(sortOrder);
//     }, [sortColumn, sortOrder]);
//
//     const handleSort = (column: string) => {
//         let newOrder: "asc" | "desc" = "asc";
//
//         if (currentCol === column) {
//             newOrder = currentOrder === "asc" ? "desc" : "asc";
//         }
//
//         setCurrentCol(column);
//         setCurrentOrder(newOrder);
//
//         onSortChange(column, newOrder);
//     };
//
//     return (
//         <div className="header-component">
//             <ul>
//                 {columns.map((col) => (
//                     <li
//                         key={col}
//                         onClick={() => handleSort(col)}
//                         style={{ cursor: "pointer" }}
//                     >
//                         {col} {currentCol === col ? (currentOrder === "asc" ? "↑" : "↓") : ""}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
//
//


'use client';
import React from "react";

interface HeaderProps {
    sortColumn: string;
    sortOrder: "asc" | "desc";
    onSortChange: (column: string, order: "asc" | "desc") => void;
}

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "surname", label: "Surname" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "age", label: "Age" },
    { key: "course", label: "Course" },
    { key: "course_format", label: "Format" },
    { key: "course_type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "sum", label: "Sum" },
    { key: "already_paid", label: "Paid" },
    { key: "group", label: "Group" },
    { key: "created_at", label: "Created" },
    { key: "manager", label: "Manager" },
];

const ORDER_BY_MAP: Record<string, string> = {
    name: "name",
    age: "age",
    created_at: "createdAt",
};

export default function HeaderComponent({ sortColumn, sortOrder, onSortChange }: HeaderProps) {
    const handleSort = (key: string) => {
        let order: "asc" | "desc" = "asc";
        if (sortColumn === ORDER_BY_MAP[key] && sortOrder === "asc") {
            order = "desc";
        }
        onSortChange(key, order);
    };

    return (
        <ul className="user-row header">
            {columns.map(col => (
                <li
                    key={col.key}
                    className={sortColumn === ORDER_BY_MAP[col.key] ? "sorted" : ""}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: "pointer" }}
                >
                    {col.label}
                    {sortColumn === ORDER_BY_MAP[col.key] ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                </li>
            ))}
        </ul>
    );
}
