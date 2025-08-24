'use client';

import { FC, useState } from 'react';
import { ICommentComponentProps } from "@/app/models/ICommentComponentProps";

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
        <div className="comments-section">
            {comments[user._id]?.length ? (
                <ul>
                    {comments[user._id].map((c, idx) => (
                        <li key={idx}>{c}</li>
                    ))}
                </ul>
            ) : (
                <p></p>
            )}

            <div className="comment-form">
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
            </div>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default CommentComponent;



