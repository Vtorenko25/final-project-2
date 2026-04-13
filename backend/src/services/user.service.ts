import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IUser,
  IUserListQuery,
  IUserListResponse,
} from "../interfaces/user.interface";
import { Group } from "../models/group.model";
import { userPresenter } from "../presenters/user.presenter";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAllUsers(query: IUserListQuery): Promise<IUserListResponse> {
    const [entities, total] = await userRepository.getAllUsers(query);
    return userPresenter.toListResDto(entities, total, query);
  }

  public async getAllUsersStatistic(): Promise<Record<string, number>> {
    return await userRepository.getAllUsersStatistic();
  }

  public async updateUserById(
    tokenPayload: ITokenPayload,
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return await userRepository.updateById(userId, dto);
  }

  public async getAllGroups(): Promise<string[]> {
    return await userRepository.getAllGroups();
  }

  public async createGroup(name: string): Promise<string> {
    if (!name) {
      throw new ApiError("Group name is required", 400);
    }

    const groups = await userRepository.getAllGroups();

    const exists = groups.includes(name);

    if (exists) {
      throw new ApiError("Group already exists", 409);
    }

    return name;
  }

  public async addGroupToUser(userId: string, name: string): Promise<IUser> {
    if (!name) {
      throw new ApiError("Group name is required", 400);
    }

    const user = await userRepository.getById(userId);
    if (!user) throw new ApiError("User not found", 404);

    let group = await Group.findOne({ name });

    if (!group) {
      group = await Group.create({ name });
    }

    const updatedUser = await userRepository.updateById(userId, {
      group: name,
    });

    return updatedUser;
  }
}

export const userService = new UserService();
