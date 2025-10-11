// import { ApiError } from "../errors/api.error";
// import { ITokenPayload } from "../interfaces/token.interface";
// import {
//   IUser,
//   IUserListQuery,
//   IUserListResponse,
// } from "../interfaces/user.interface";
// import { userPresenter } from "../presenters/user.presenter";
// import { userRepository } from "../repositories/user.repository";
//
// class UserService {
//   public async getAllUsers(query: IUserListQuery): Promise<IUserListResponse> {
//     const [entities, total] = await userRepository.getAllUsers(query);
//     return userPresenter.toListResDto(entities, total, query);
//   }
//
//   public async updateUserById(
//     tokenPayload: ITokenPayload,
//     userId: string,
//     dto: Partial<IUser>,
//   ): Promise<IUser> {
//     const user = await userRepository.getById(userId);
//     if (!user) throw new ApiError("User not found", 404);
//
//     if (tokenPayload.role !== "admin" && tokenPayload.userId !== userId) {
//       throw new ApiError("Forbidden: you can't edit this user", 403);
//     }
//
//     return await userRepository.updateById(userId, dto);
//   }
// }
// export const userService = new UserService();

import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IUser,
  IUserListQuery,
  IUserListResponse,
} from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenter";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAllUsers(query: IUserListQuery): Promise<IUserListResponse> {
    const [entities, total] = await userRepository.getAllUsers(query);
    return userPresenter.toListResDto(entities, total, query);
  }

  public async getAllUsersStatistic(): Promise<Record<string, number>> {
    const stats = await userRepository.getAllUsersStatistic();
    return stats;
  }

  public async updateUserById(
    tokenPayload: ITokenPayload,
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) throw new ApiError("User not found", 404);

    if (tokenPayload.role !== "admin" && tokenPayload.userId !== userId) {
      throw new ApiError("Forbidden: you can't edit this user", 403);
    }

    return await userRepository.updateById(userId, dto);
  }
}

export const userService = new UserService();
