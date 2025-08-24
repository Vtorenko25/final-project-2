import { urlBuilder } from "@/app/services/api.service";
import { IComment } from "@/app/models/IComment";

export const commentService = {
    createComment: async (dto: IComment) => {
        try {
            const tokensPair = localStorage.getItem('tokens');
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const { accessToken } = JSON.parse(tokensPair);
            const response = await fetch(urlBuilder.createComment(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create comment");
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    },

    getCommentsByUser: async (crmId: string): Promise<IComment[]> => {
        try {
            const tokensPair = localStorage.getItem("tokens");
            if (!tokensPair) throw new Error("No tokens found in localStorage");

            const { accessToken } = JSON.parse(tokensPair);

            const response = await fetch(urlBuilder.getCommentsByUser(crmId), {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch comments");
            }

            const comments: IComment[] = await response.json();
            return comments;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    },

};


