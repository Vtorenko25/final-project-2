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

            <div className="message_utm_block">
            <div><strong>Message:</strong> {user.msg ? String(user.msg) : "null"}</div>
            <div><strong>UTM:</strong> {user.utm ? String(user.utm) : "null"}</div>
            </div>

            <div className="comments_block">
            {comments[user._id]?.length ? (
                <div style={{marginTop: '10px'}}>
                    <h4>Comments</h4>
                    <ul>
                        {comments[user._id].map((c, idx) => (
                            <li key={idx}>{c}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
            <div className="comments-section">
                <input
                    type="text"
                    value={newComment[user._id] || ""}
                    onChange={(e) => handleInputChange(user._id, e.target.value)}
                    placeholder="Comment"
                    disabled={loading}
                    style={{padding: '6px', marginRight: '8px'}}
                />
                <button onClick={submitComment} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
                {error && <p>{error}</p>}
            </div>
            </div>


        </div>
    );
};

export default CommentComponent;
