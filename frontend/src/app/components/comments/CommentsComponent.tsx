'use client';

import { FC, useState } from 'react';
import { ICommentComponentProps } from "@/app/models/ICommentComponentProps";
import "./comments-component.css"

const CommentComponent: FC<ICommentComponentProps> = ({
                                                          user,
                                                          comments,
                                                          newComment,
                                                          handleInputChange,
                                                          handleAddComment,
                                                      }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitComment = async () => {
        if (!newComment[user._id]) return;

        setLoading(true);
        setError(null);

        try {
            await handleAddComment(user);
        } catch (err: any) {
            setError(err.message || "Помилка при додаванні коментаря");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments">

            <div className="message_block">
            <div><strong>Message:</strong> {user.msg ? String(user.msg) : "null"}</div>
            <div><strong>UTM:</strong> {user.utm ? String(user.utm) : "null"}</div>
            </div>
            <div>

                <div className="comments_block">
                    {comments[user._id]?.length ? (
                        <div >
                                {comments[user._id].map((comment, index) => (
                                    <div className="comments_block_comment" key={index}>
                                        <div>{comment.content} </div>
                                        <div className="comments_block_manager">
                                        <div>{comment.manager}</div>
                                        <div> {comment.createdAt
                                            ? new Date(comment.createdAt).toLocaleString("uk-UA", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "—"} </div></div></div>
                                ))}
                        </div>
                    ) : null}
                    <div className="comments-section">
                        <input
                            type="text"
                            value={newComment[user._id] || ""}
                            onChange={(e) => handleInputChange(user._id, e.target.value)}
                            placeholder="Comment"
                            disabled={loading}
                        />
                        <button onClick={submitComment} disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                        {error && <p>{error}</p>}
                    </div>
                </div>
            </div>

            <button className="button_edit">EDIT</button>

        </div>
    );
};

export default CommentComponent;


