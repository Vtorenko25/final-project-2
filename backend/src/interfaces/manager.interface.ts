export interface IManager {
  id: string;
  email: string;
  name: string;
  surname: string;
  is_active: boolean;
  last_login?: string;
}

export interface IManagerListQuery {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IManagerListResponse {
  data: IManagerResponse[];
  total: number;
}

export type IManagerResponse = Pick<
  IManager,
  "name" | "surname" | "email" | "is_active" | "last_login"
>;
