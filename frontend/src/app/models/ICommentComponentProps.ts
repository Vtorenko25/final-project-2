
import {IUser} from "@/app/models/IUser";

export interface ICommentComponentProps {
    user: IUser;
    comments: { [key: string]: string[] };
    newComment: { [key: string]: string };
    handleInputChange: (userId: string, value: string) => void;
    handleAddComment: (user: IUser) => void;
}
