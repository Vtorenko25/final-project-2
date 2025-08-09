import {base} from "@/app/constans/urls";

export const urlBuilder={
    getAllUsers:()=> base + '/users?page=',
    authUser:()=> base + '/auth/sign-in',
}
