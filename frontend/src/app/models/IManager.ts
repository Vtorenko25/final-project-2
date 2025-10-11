export interface IManager {
    email: string;
    name: string;
    surname: string;
    is_active: string;
    last_login: string;
    manager_id: number;
}

export interface IManagerCreate {
    email: string;
    name: string;
    surname: string;
    is_active?: string;
    last_login?: string;
}