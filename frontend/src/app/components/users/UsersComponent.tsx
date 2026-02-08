
'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IUser } from "@/app/models/IUser";
import { IComment } from "@/app/models/IComment";
import { userService } from "@/app/services/user.service";
import { commentService } from "@/app/services/comment.service";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import CommentComponent from "@/app/components/comments/CommentsComponent";
import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
import FilterComponent from "../filter/FilterComponent";
import HeaderComponent from "@/app/components/header/HeaderComponent";
import { getCurrentManagerEmail, getUserRole } from "@/app/helpers/role";

import "./users-component.css";

interface UsersComponentProps {
    setTotalUsers: (total: number) => void;
    usersPerPage: number;
}

const defaultFilters: Record<string, string> = {
    name: "", surname: "", email: "", phone: "", age: "",
    course: "", course_format: "", course_type: "", status: "", group: "",
    startDate: "", endDate: "",
};

export default function UsersComponent({ setTotalUsers, usersPerPage }: UsersComponentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isFirstRender = useRef(true);

    const [users, setUsers] = useState<IUser[]>([]);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [comments, setComments] = useState<Record<string, IComment[]>>({});
    const [newComment, setNewComment] = useState<Record<string, string>>({});
    const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>(defaultFilters);
    const [myOnly, setMyOnly] = useState(false);

    const [sortColumn, setSortColumn] = useState<keyof IUser>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [page, setPage] = useState<number>(1);

    const displayValue = (value: any) =>
        value === null || value === undefined || value === "" ? "null" : value;

    useEffect(() => {
        const newPage = parseInt(searchParams.get("page") || "1", 10);
        setPage(newPage);
    }, [searchParams]);

    useEffect(() => {
        const newFilters = { ...defaultFilters };
        Object.keys(defaultFilters).forEach(key => {
            const val = searchParams.get(key);
            if (val) newFilters[key] = val;
        });
        setFilters(newFilters);
        setDebouncedFilters(newFilters);

        const order = searchParams.get("order") as keyof IUser;
        const direction = searchParams.get("direction") as "asc" | "desc";
        if (order) setSortColumn(order);
        if (direction) setSortOrder(direction);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedFilters(filters), 500);
        return () => clearTimeout(handler);
    }, [filters]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams();

        Object.entries(debouncedFilters).forEach(([field, value]) => {
            if (value.trim()) params.set(field, value);
        });

        if (sortColumn) params.set("order", sortColumn);
        if (sortOrder) params.set("direction", sortOrder);

        params.set("page", page.toString());

        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    }, [debouncedFilters, sortColumn, sortOrder, page, router]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        setDebouncedFilters(defaultFilters);
        setPage(1);
        setMyOnly(false);
    };

    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", usersPerPage.toString());

            Object.entries(debouncedFilters).forEach(([k, v]) => {
                if (v) params.set(k, v);
            });

            if (myOnly && getUserRole()) params.set("myOnly", getUserRole()!);

            const response = await userService.getFilterUsers(`?${params.toString()}`);
            setUsers(response.data);
            setTotalUsers(response.total);
        } catch (err) {
            console.error("Помилка завантаження:", err);
            setUsers([]);
            setTotalUsers(0);
        }
    }, [page, debouncedFilters, myOnly, usersPerPage, setTotalUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }

            const aDate = new Date(aValue as any).getTime();
            const bDate = new Date(bValue as any).getTime();
            if (!isNaN(aDate) && !isNaN(bDate)) {
                return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
            }

            const aStr = String(aValue || "").toLowerCase();
            const bStr = String(bValue || "").toLowerCase();
            if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
            if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [users, sortColumn, sortOrder]);

    const toggleComments = async (userId: string, user: IUser) => {
        const newOpen = openUserId === userId ? null : userId;
        setOpenUserId(newOpen);

        if (newOpen && !comments[user._id]) {
            try {
                const userComments = await commentService.getCommentsByUser(user.id.toString());
                setComments(prev => ({ ...prev, [user._id]: userComments }));
            } catch {
                setComments(prev => ({ ...prev, [user._id]: [] }));
            }
        }
    };

    const handleInputChange = (userId: string, value: string) =>
        setNewComment(prev => ({ ...prev, [userId]: value }));

    const handleAddComment = useCallback(async (user: IUser) => {
        const text = newComment[user._id];
        if (!text) return;

        try {
            const role = getCurrentManagerEmail();
            if (!role) return;

            const savedComment = await commentService.createComment({
                userId: user._id,
                crmId: user.id,
                content: text,
                manager: role,
                createdAt: new Date().toISOString(),
                title: ""
            });

            setComments(prev => ({
                ...prev,
                [user._id]: [...(prev[user._id] || []), savedComment],
            }));

            const updated = await userService.updateUserById(user._id, { status: "In Work", manager: role });
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...updated } : u));

            handleInputChange(user._id, "");
        } catch (err) {
            console.error(err);
        }
    }, [newComment]);

    const handleSortChange = (column: string, order?: "asc" | "desc") => {
        const col = column as keyof IUser;
        let newOrder: "asc" | "desc" = order || "asc";

        if (sortColumn === col) {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        setSortColumn(col);
        setSortOrder(newOrder);
    };

    const handleExportExcel = () => {
        if (!users.length) return;
        const ws = XLSX.utils.json_to_sheet(users.map(u => ({
            id: u.id,
            name: u.name,
            surname: u.surname,
            email: u.email,
            phone: u.phone,
            age: u.age,
            course: u.course,
            course_format: u.course_format,
            course_type: u.course_type,
            status: u.status,
            sum: u.sum,
            already_paid: u.already_paid,
            group: u.group,
            created_at: u.created_at,
            manager: u.manager
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        const data = new Blob(
            [XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
            { type: 'application/octet-stream' }
        );
        saveAs(data, 'users.xlsx');
    };

    return (
        <div className="users-container">
            <div className="filter-wrapper">
                <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
                <div className="filter-wrapper-buttons">
                    <label className="my-checkbox">
                        <input type="checkbox" checked={myOnly} onChange={() => setMyOnly(!myOnly)} /> My
                    </label>
                    <button onClick={resetFilters}>⟳</button>
                    <button onClick={handleExportExcel}>Export Excel</button>
                </div>
            </div>

            <HeaderComponent
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            {sortedUsers.length > 0 ? sortedUsers.map(u => (
                <div key={u._id} className="user-block">
                    <ul className="user-row" onClick={() => toggleComments(u._id, u)}>
                        <li>{displayValue(u.id)}</li>
                        <li>{displayValue(u.name)}</li>
                        <li>{displayValue(u.surname)}</li>
                        <li>{displayValue(u.email)}</li>
                        <li>{displayValue(u.phone)}</li>
                        <li>{displayValue(u.age)}</li>
                        <li>{displayValue(u.course)}</li>
                        <li>{displayValue(u.course_format)}</li>
                        <li>{displayValue(u.course_type)}</li>
                        <li>{displayValue(u.status || "New")}</li>
                        <li>{displayValue(u.sum)}</li>
                        <li>{displayValue(u.already_paid)}</li>
                        <li>{displayValue(u.group)}</li>
                        <li>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "null"}</li>
                        <li>{displayValue(u.manager || "null")}</li>
                    </ul>

                    {openUserId === u._id && (
                        <CommentComponent
                            user={u}
                            comments={comments}
                            newComment={newComment}
                            handleInputChange={handleInputChange}
                            handleAddComment={handleAddComment}
                            onUpdateUser={(updated) =>
                                setUsers(prev => prev.map(us => us._id === updated._id ? updated : us))
                            }
                        />
                    )}
                </div>
            )) : <p>No data</p>}

            {selectedUser && (
                <UserUpdateComponent
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdateUser={(updated) =>
                        setUsers(prev => prev.map(u => u._id === updated._id ? updated : u))
                    }
                />
            )}
        </div>
    );
}
