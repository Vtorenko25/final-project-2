'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IUser } from "@/app/models/IUser";
import { IComment } from "@/app/models/IComment";
import { userService } from "@/app/services/user.service";
import { commentService } from "@/app/services/comment.service";
import { sortData } from "@/app/helpers/sortData";

import HeaderComponent from "@/app/components/header/HeaderComponent";
import CommentComponent from "@/app/components/comments/CommentsComponent";
import "./users-component.css";

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [sortColumn, setSortColumn] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [openUserId, setOpenUserId] = useState<string | null>(null);

    const [comments, setComments] = useState<Record<string, string[]>>({});
    const [newComment, setNewComment] = useState<Record<string, string>>({});

    const page = parseInt(searchParams.get('page') || '1', 10);
    const usersPerPage = 25;

    useEffect(() => {
        const fetchUsersAndComments = async () => {
            try {
                const initialData = await userService.getAllUsers(1);
                const total = initialData.total || initialData.data?.length || 0;
                setTotalUsers(total);

                const totalPages = Math.ceil(total / usersPerPage);
                const serverPage = totalPages - page + 1;

                const data = await userService.getAllUsers(serverPage);
                const fetchedUsers: IUser[] = Array.isArray(data.data) ? data.data : data;
                const sortedUsers = sortData(fetchedUsers, sortColumn, sortOrder);
                setUsers(sortedUsers);


                const commentsMap: Record<string, string[]> = {};
                await Promise.all(
                    sortedUsers.map(async (user) => {
                        try {
                            const userComments: IComment[] = await commentService.getCommentsByUser(user.id.toString());
                            commentsMap[user._id] = userComments.map(c => c.content);
                        } catch (err) {
                            commentsMap[user._id] = [];
                        }
                    })
                );
                setComments(commentsMap);
            } catch (err) {
                console.error('Помилка завантаження:', err);
                setUsers([]);
                setTotalUsers(0);
            }
        };

        fetchUsersAndComments();
    }, [page, sortColumn, sortOrder]);

    const handleSortChange = (column: string, order: "asc" | "desc") => {
        setSortColumn(column);
        setSortOrder(order);

        const params = new URLSearchParams(searchParams.toString());
        params.set("order", column);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    const toggleComments = (userId: string) => {
        setOpenUserId(openUserId === userId ? null : userId);
    };

    const handleInputChange = (userId: string, value: string) => {
        setNewComment((prev) => ({ ...prev, [userId]: value }));
    };

    const handleAddComment = async (user: IUser) => {
        const text = newComment[user._id];
        if (!text) return;

        try {
            const dto: IComment = {
                userId: user._id,
                crmId: user.id,
                content: text,
                manager: user.manager || "admin",
            };

            const savedComment = await commentService.createComment(dto);

            setComments((prev) => ({
                ...prev,
                [user._id]: [...(prev[user._id] || []), savedComment.content],
            }));

            setNewComment((prev) => ({ ...prev, [user._id]: "" }));

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === user._id && !u.status
                        ? { ...u, status: "In Work" }
                        : u
                )
            );
        } catch (err) {
            console.error("Помилка при створенні коментаря:", err);
        }
    };

    return (
        <div className="users-container">
            <HeaderComponent
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user._id} className="user-block">
                        <ul className="user-row" onClick={() => toggleComments(user._id)}>
                            <li>{user.id || "null"}</li>
                            <li>{user.name || "null"}</li>
                            <li>{user.surname || "null"}</li>
                            <li>{user.email || "null"}</li>
                            <li>{user.phone || "null"}</li>
                            <li>{user.age || "null"}</li>
                            <li>{user.course || "null"}</li>
                            <li>{user.course_format || "null"}</li>
                            <li>{user.course_type || "null"}</li>
                            <li>{user.status || "null"}</li>
                            <li>{user.sum || "null"}</li>
                            <li>{user.already_paid || "null"}</li>
                            <li>{user.group || "null"}</li>
                            <li>{user.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "null"}
                            </li>
                            <li>{user.manager || "admin"}</li>
                        </ul>

                        {openUserId === user._id && (
                            <CommentComponent
                                user={user}
                                comments={comments}
                                newComment={newComment}
                                handleInputChange={handleInputChange}
                                handleAddComment={handleAddComment}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>Немає даних</p>
            )}
        </div>
    );
}
