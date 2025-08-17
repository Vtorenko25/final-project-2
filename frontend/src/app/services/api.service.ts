import {base} from "@/app/constans/urls";

export const urlBuilder = {
    getAllUsers: (page: number) => `${base}/users?page=${page}`,
    authUser: () => base + '/auth/sign-in',
};
