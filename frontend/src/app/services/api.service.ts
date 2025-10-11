import {base} from "@/app/constans/urls";

export const urlBuilder = {
    getAllUsers: (page: number) => `${base}/users?page=${page}`,
    authUser: () => `${base}/auth/sign-in`,
    createComment:()=> `${base}/comment/create`,
    getCommentsByUser: (crmId:string) => `${base}/comment/${crmId}`,
    updateUserById: (id: string) => `${base}/users/${id}`,
    getAllGroups: () => `/groups`,
    createGroup: () => `/groups`,
    createManager:()=>`${base}/managers/create`,
    getAllManagers: (page:number) => `${base}/managers?page=${page}`,
};