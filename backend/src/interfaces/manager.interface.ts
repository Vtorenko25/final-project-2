export interface IManager {
  id: string;
  email: string;
  name: string;
  surname: string;
  is_active: boolean;
}

export interface IManagerListQuery {
  limit?: number;
  page?: number;
}
