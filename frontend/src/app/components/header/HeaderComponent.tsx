'use client';

import React from "react";
import "./header-component.css";

interface HeaderComponentProps {
    sortColumn: string;
    sortOrder: "asc" | "desc";
    onSortChange: (column: string, order: "asc" | "desc") => void;
}

const COLUMNS = [
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
    { key: "created_at", label: "Created At" },
    { key: "manager", label: "Manager" },
];

export default function HeaderComponent({ sortColumn, sortOrder, onSortChange }: HeaderComponentProps) {

    const handleHeaderClick = (columnKey: string) => {
        if(columnKey === sortColumn){
            const newOrder = sortOrder === "asc" ? "desc" : "asc";
            onSortChange(columnKey, newOrder);
        } else {
            onSortChange(columnKey, "asc");
        }
    }

    const renderSortIcon = (columnKey: string) => {
        if(columnKey !== sortColumn) return "⇅";
        return sortOrder === "asc" ? "▲" : "▼";
    }

    return (
        <ul className="user-header">
            {COLUMNS.map(col => (
                <li
                    key={col.key}
                    className="user-header-cell"
                    onClick={() => handleHeaderClick(col.key)}
                    style={{ cursor: "pointer" }}
                >
                    {col.label} {renderSortIcon(col.key)}
                </li>
            ))}
        </ul>
    )
}
