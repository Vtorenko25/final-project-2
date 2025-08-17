'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import "./header-component.css";
import {headerColumns} from "@/app/constans/header.columns";

const columns = headerColumns;

export default function HeaderComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        const order = searchParams.get("order");
        if (order) setSortColumn(order);
        // Початковий порядок завжди "asc"
        setSortOrder("asc");
    }, [searchParams]);

    const handleSort = (column: string) => {
        let newOrder: "asc" | "desc" = "asc";

        if (sortColumn === column) {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        setSortColumn(column);
        setSortOrder(newOrder);

        const currentPage = searchParams.get("page") || "1";
        router.push(`/orders?page=${currentPage}&order=${column}`);
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
                        {col} {sortColumn === col ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}
