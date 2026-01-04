'use client';

import React from "react";
import {
    courseOptions,
    courseFormatOptions,
    courseTypeOptions,
    statusOptions,
    groupOptions
} from "@/app/constans/course.columns";

import "./filter-component.css";

interface FilterProps {
    filters: Record<string, string>;
    onFilterChange: (field: string, value: string) => void;
}

export default function FilterComponent({ filters, onFilterChange }: FilterProps) {
    return (
        <div className="filter-component">
            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Name"
                    value={filters.name || ""}
                    onChange={(e) => onFilterChange("name", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={filters.surname || ""}
                    onChange={(e) => onFilterChange("surname", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={filters.email || ""}
                    onChange={(e) => onFilterChange("email", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={filters.phone || ""}
                    onChange={(e) => onFilterChange("phone", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={filters.age || ""}
                    onChange={(e) => onFilterChange("age", e.target.value)}
                />

                <select
                    value={filters.course || ""}
                    onChange={(e) => onFilterChange("course", e.target.value)}
                >
                    <option value="">All courses</option>
                    {courseOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className="filter-row">
                <select
                    value={filters.course_format || ""}
                    onChange={(e) => onFilterChange("course_format", e.target.value)}
                >
                    <option value="">All formats</option>
                    {courseFormatOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={filters.course_type || ""}
                    onChange={(e) => onFilterChange("course_type", e.target.value)}
                >
                    <option value="">All types</option>
                    {courseTypeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={filters.status || ""}
                    onChange={(e) => onFilterChange("status", e.target.value)}
                >
                    <option value="">All statuses</option>
                    {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={filters.group || ""}
                    onChange={(e) => onFilterChange("group", e.target.value)}
                >
                    <option value="">All groups</option>
                    {groupOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Start date"
                    value={filters.startDate || ""}
                    onChange={(e) => onFilterChange("startDate", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="End date"
                    value={filters.endDate || ""}
                    onChange={(e) => onFilterChange("endDate", e.target.value)}
                />
            </div>
        </div>
    );
}
