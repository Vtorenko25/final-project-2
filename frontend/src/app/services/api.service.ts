import {base} from "@/app/constans/urls";

export const urlBuilder={
    getAllUsers:()=> base + '/users',
    authUser:()=> base + '/auth/sign-in',
}


