import { IComment } from "./IComment";
import {IUser} from "@/app/models/IUser";

export interface ICommentComponentProps {
    user: IUser;
    comments: { [key: string]: IComment[] };
    newComment: { [key: string]: string };
    handleInputChange: (userId: string, value: string) => void;
    handleAddComment: (user: IUser) => void;
}