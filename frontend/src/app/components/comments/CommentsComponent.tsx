'use client';

import { FC, useState } from 'react';
import { ICommentComponentProps } from "@/app/models/ICommentComponentProps";
import "./comments-component.css";
import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
import { getCurrentManagerEmail } from "@/app/helpers/role";
import {IUserUpdateDto} from "@/app/models/IUser";

const CommentComponent: FC<ICommentComponentProps & { onUpdateUser?: (updatedUser: any) => void }> = ({
                                                                                                          user,
                                                                                                          comments,
                                                                                                          newComment,
                                                                                                          handleInputChange,
                                                                                                          handleAddComment,
                                                                                                          onUpdateUser
                                                                                                      }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const currentManager = getCurrentManagerEmail();

    const canComment = user.status === null || user.manager === null || (user.status === "In Work" && user.manager === currentManager);
    const canEdit = user.status === null || user.manager === null || (user.status === "In Work" && user.manager === currentManager);

    const submitComment = async () => {
        const text = newComment[user._id];
        if (!text || !canComment) return;

        setLoading(true);
        setError(null);

        try {
            await handleAddComment(user);
            handleInputChange(user._id, "");
        } catch (err: any) {
            setError(err.message || "Помилка при додаванні коментаря");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments">
            <div className="message_block">
                <div><strong>Message:</strong> {user.msg || "null"}</div>
                <div><strong>UTM:</strong> {user.utm || "null"}</div>
            </div>

            <div className="comments_block">
                {comments[user._id]?.length ? (
                    comments[user._id].slice(-3).map((comment) => (
                        <div className="comments_block_comment" key={comment.createdAt + comment.content}>
                            <div>{comment.content}</div>
                            <div className="comments_block_manager">
                                <div>{comment.manager}</div>
                                <div>
                                    {comment.createdAt
                                        ? new Date(comment.createdAt).toLocaleString("uk-UA", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "—"}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Коментарів немає</p>
                )}

                <div className="comments-section">
                    <input
                        type="text"
                        value={newComment[user._id] || ""}
                        onChange={(e) => handleInputChange(user._id, e.target.value)}
                        placeholder={canComment ? "Comment" : "Немає доступу для коментування"}
                        disabled={loading || !canComment}
                    />
                    <button onClick={submitComment} disabled={loading || !canComment}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>

            <button
                className="button_edit"
                onClick={() => canEdit && setShowEditModal(true)}
                disabled={!canEdit}
                title={!canEdit ? "Немає доступу до редагування" : "Редагувати"}
            >
                EDIT
            </button>

            {showEditModal && (
                <UserUpdateComponent
                    user={user}
                    onClose={() => setShowEditModal(false)}
                    onUpdateUser={onUpdateUser}
                />
            )}
        </div>
    );
};

export default CommentComponent;

