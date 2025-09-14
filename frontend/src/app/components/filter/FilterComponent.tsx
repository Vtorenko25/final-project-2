'use client';

import { useState } from "react";
import "./filter-component.css";
import {
    courseOptions,
    courseFormatOptions,
    courseTypeOptions,
    statusOptions, groupOptions
} from "@/app/constans/course.columns";


export default function FilterComponent() {
    const [filters, setFilters] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        age: "",
        course: "",
        format: "",
        type: "",
        status: "",
        group: "",
        startDate: "",
        endDate: "",
    });


    const handleChange = (field: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        console.log("🔍 Застосовані фільтри:", filters);
        // TODO: передати фільтри у запит до API
    };

    return (
        <div className="filter-component">
            {/* Верхній блок */}
            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Name"
                    value={filters.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={filters.surname}
                    onChange={(e) => handleChange("surname", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={filters.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={filters.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={filters.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                />
                <select
                    value={filters.course}
                    onChange={(e) => handleChange("course", e.target.value)}
                >
                    <option value="">All courses</option>
                    {courseOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {/* Нижній блок */}
            <div className="filter-row">
                <select
                    value={filters.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                >
                    <option value="">All formats</option>
                    {courseFormatOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                >
                    <option value="">All types</option>
                    {courseTypeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>

                {/* 👇 Новий select для статусів */}
                <select
                    value={filters.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                >
                    <option value="">All statuses</option>
                    {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.group}
                    onChange={(e) => handleChange("group", e.target.value)}
                >
                    <option value="">all groups</option>
                    {groupOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>


                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                />
            </div>
        </div>
    );
}

