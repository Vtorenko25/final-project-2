import {
  IUser,
  IUserListQuery,
  IUserListResponse,
  IUserResponse,
} from "../interfaces/user.interface";

class UserPresenter {
  public toPublicResDto(entity: IUser): IUserResponse {
    return {
      _id: entity._id,
      name: entity.name,
      surname: entity.surname,
      email: entity.email,
      phone: entity.phone,
      age: entity.age,
      role: entity.role,
      course: entity.course,
      course_format: entity.course_format,
      course_type: entity.course_type,
      sum: entity.sum,
      already_paid: entity.already_paid,
      created_at: entity.created_at,
      utm: entity.utm,
      msg: entity.msg,
      status: entity.status,
      manager: entity.manager,
      group: entity.group,
    };
  }

  public toListResDto(
    entities: IUser[],
    total: number,
    query: IUserListQuery,
  ): IUserListResponse {
    return {
      data: entities.map(this.toPublicResDto),
      total,
      ...query,
    };
  }
}

export const userPresenter = new UserPresenter();
