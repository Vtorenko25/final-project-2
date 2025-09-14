import {IUser} from "@/app/models/IUser";

export interface IUserUpdateComponentProps {
    user: IUser;
    onClose: () => void;
    onUpdateUser?: (updatedUser: IUser) => void;
}