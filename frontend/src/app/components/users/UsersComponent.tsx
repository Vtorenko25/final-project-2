'use client';

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IUser } from "@/app/models/IUser";
import { IComment } from "@/app/models/IComment";
import { userService } from "@/app/services/user.service";
import { commentService } from "@/app/services/comment.service";
import { sortData } from "@/app/helpers/sortData";

import HeaderComponent from "@/app/components/header/HeaderComponent";
import CommentComponent from "@/app/components/comments/CommentsComponent";
import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";

import "./users-component.css";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const [comments, setComments] = useState<Record<string, IComment[]>>({});
    const [newComment, setNewComment] = useState<Record<string, string>>({});

    const page = parseInt(searchParams.get("page") || "1", 10);
    const sortColumn = searchParams.get("order") || "id";
    const sortOrder = (searchParams.get("direction") as "asc" | "desc") || "asc";
    const usersPerPage = 25;

    const displayValue = (value: any) => value === null || value === undefined || value === "" ? "null" : value;

    useEffect(() => {
        const fetchUsersAndComments = async () => {
            try {
                const initialData = await userService.getAllUsers(1);
                const total = initialData.total || initialData.data?.length || 0;
                setTotalUsers(total);

                const totalPages = Math.ceil(total / usersPerPage);
                const serverPage = Math.max(totalPages - page + 1, 1);

                const data = await userService.getAllUsers(serverPage);
                const fetchedUsers: IUser[] = Array.isArray(data.data) ? data.data : data;

                const sortedUsers = sortData(fetchedUsers, sortColumn, sortOrder);
                setUsers(sortedUsers);

                const commentsMap: Record<string, IComment[]> = {};
                await Promise.all(
                    sortedUsers.map(async (user) => {
                        try {
                            const userComments: IComment[] = await commentService.getCommentsByUser(user.id.toString());
                            commentsMap[user._id] = userComments;
                        } catch {
                            commentsMap[user._id] = [];
                        }
                    })
                );
                setComments(commentsMap);
            } catch (err) {
                console.error("Помилка завантаження:", err);
                setUsers([]);
                setTotalUsers(0);
            }
        };

        fetchUsersAndComments();
    }, [page, sortColumn, sortOrder]);

    const handleSortChange = (column: string, order: "asc" | "desc") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("order", column);
        params.set("direction", order);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    const toggleComments = (userId: string) => setOpenUserId(openUserId === userId ? null : userId);
    const handleInputChange = (userId: string, value: string) => setNewComment(prev => ({ ...prev, [userId]: value }));

    const handleAddComment = useCallback(async (user: IUser) => {
        const text = newComment[user._id];
        if (!text) return;

        try {
            const dto: IComment = {
                userId: user._id,
                crmId: user.id,
                content: text,
                manager: user.manager || "admin",
                createdAt: new Date().toISOString(),
                title: "",
            };

            const savedComment = await commentService.createComment(dto);

            setComments(prev => ({
                ...prev,
                [user._id]: [...(prev[user._id] || []), savedComment],
            }));

            const inWork = await userService.updateUserById(user._id, {
                status: "In Work",
                manager: "admin",
            });

            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...inWork } : u));
            handleInputChange(user._id, "");
        } catch (err) {
            console.error("Помилка при створенні коментаря:", err);
        }
    }, [newComment]);

    const handleUpdateUser = (updatedUser: IUser) => {
        setUsers(prev =>
            prev.map(u => u._id === updatedUser._id ? { ...u, ...updatedUser } : u)
        );
    };

    return (
        <div className="users-container">
            <HeaderComponent
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            {users.length > 0 ? (
                users.map(user => (
                    <div key={user._id} className="user-block">
                        <ul className="user-row" onClick={() => toggleComments(user._id)}>
                            <li>{displayValue(user.id)}</li>
                            <li>{displayValue(user.name)}</li>
                            <li>{displayValue(user.surname)}</li>
                            <li>{displayValue(user.email)}</li>
                            <li>{displayValue(user.phone)}</li>
                            <li>{displayValue(user.age)}</li>
                            <li>{displayValue(user.course)}</li>
                            <li>{displayValue(user.course_format)}</li>
                            <li>{displayValue(user.course_type)}</li>
                            <li>{displayValue(user.status)}</li>
                            <li>{displayValue(user.sum)}</li>
                            <li>{displayValue(user.already_paid)}</li>
                            <li>{displayValue(user.group)}</li>
                            <li>{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }) : "null"}</li>
                            <li>{displayValue(user.manager || "null")}</li>
                        </ul>

                        {openUserId === user._id && (
                            <CommentComponent
                                user={user}
                                comments={comments}
                                newComment={newComment}
                                handleInputChange={handleInputChange}
                                handleAddComment={handleAddComment}
                                onUpdateUser={handleUpdateUser}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>Немає даних</p>
            )}

            {selectedUser && (
                <UserUpdateComponent
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdateUser={handleUpdateUser}
                />
            )}
        </div>
    );
}

