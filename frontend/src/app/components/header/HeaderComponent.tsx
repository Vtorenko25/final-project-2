'use client';

import { useState, useEffect } from "react";
import "./header-component.css";
import { headerColumns } from "@/app/constans/header.columns";
import {HeaderProps} from "@/app/models/IHeaderProps";



const columns = headerColumns;

export default function HeaderComponent({ sortColumn, sortOrder, onSortChange }: HeaderProps) {
    const [currentCol, setCurrentCol] = useState(sortColumn);
    const [currentOrder, setCurrentOrder] = useState<"asc" | "desc">(sortOrder);

    useEffect(() => {
        setCurrentCol(sortColumn);
        setCurrentOrder(sortOrder);
    }, [sortColumn, sortOrder]);

    const handleSort = (column: string) => {
        let newOrder: "asc" | "desc" = "asc";

        if (currentCol === column) {
            newOrder = currentOrder === "asc" ? "desc" : "asc";
        }

        setCurrentCol(column);
        setCurrentOrder(newOrder);

        onSortChange(column, newOrder);
    };

    return (
        <div className="header-component">
            <ul>
                {columns.map((col) => (
                    <li
                        key={col}
                        onClick={() => handleSort(col)}
                        style={{ cursor: "pointer" }}
                    >
                        {col} {currentCol === col ? (currentOrder === "asc" ? "↑" : "↓") : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}


