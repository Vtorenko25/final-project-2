// import {base} from "@/app/constans/urls";
//
// export const urlBuilder = {
//     getAllUsers: (page: number) => `${base}/users?page=${page}`,
//     getUsersStatistic: () => `${base}/users/statistic`,
//     authUser: () => `${base}/auth/sign-in`,
//     authManager: () => `${base}/auth/sign-in/manager`,
//     createComment:()=> `${base}/comment/create`,
//     getCommentsByUser: (crmId:string) => `${base}/comment/${crmId}`,
//     updateUserById: (id: string) => `${base}/users/${id}`,
//     getAllGroups: () => `/groups`,
//     createGroup: () => `/groups`,
//     createManager:()=>`${base}/managers/create`,
//     getAllManagers: (page:number) => `${base}/managers?page=${page}`,
//     activateAccount: (id: number) => `${base}/managers/password/${id}`,
//     banManager:(id:number) => `${base}/managers/ban/${id}`,
//     unbanManager:(id:number) => `${base}/managers/unban/${id}`,
//     createPassword:(id:number) => `${base}/managers/${id}`,
//     updateLastLogin:(id:number)=>`${base}/managers/last_login/${id}`,
//     getManagerStatistic: (email:string) => `${base}/managers/statistic/${email}`,
// };

import {base} from "@/app/constans/urls";

export const urlBuilder = {
    getAllUsers: (page: number) => `${base}/users?page=${page}`,
    getFilterUsers: (query: string) => `${base}/users${query}`,
    getUsersStatistic: () => `${base}/users/statistic`,
    authUser: () => `${base}/auth/sign-in`,
    authManager: () => `${base}/auth/sign-in/manager`,
    createComment:()=> `${base}/comment/create`,
    getCommentsByUser: (crmId:string) => `${base}/comment/${crmId}`,
    updateUserById: (id: string) => `${base}/users/${id}`,
    getAllGroups: () => `/groups`,
    createGroup: () => `/groups`,
    createManager:()=>`${base}/managers/create`,
    getAllManagers: (page:number) => `${base}/managers?page=${page}`,
    activateAccount: (id: number) => `${base}/managers/password/${id}`,
    banManager:(id:number) => `${base}/managers/ban/${id}`,
    unbanManager:(id:number) => `${base}/managers/unban/${id}`,
    createPassword:(id:number) => `${base}/managers/${id}`,
    updateLastLogin:(id:number)=>`${base}/managers/last_login/${id}`,
    getManagerStatistic: (email:string) => `${base}/managers/statistic/${email}`,
};
