import {
  IManager,
  IManagerListQuery,
  IManagerListResponse,
  IManagerResponse,
} from "../interfaces/manager.interface";

class ManagerPresenter {
  public toPublicResDto(entity: IManager): IManagerResponse {
    return {
      name: entity.name,
      surname: entity.surname,
      email: entity.email,
      is_active: entity.is_active ?? true,
      last_login: entity.last_login,
    };
  }

  public toListResDto(
    entities: IManager[],
    total: number,
    query: IManagerListQuery,
  ): IManagerListResponse {
    return {
      data: entities.map(this.toPublicResDto),
      total,
      ...query,
    };
  }
}

export const managerPresenter = new ManagerPresenter();
