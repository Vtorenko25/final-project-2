import {
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
}
export const userService = new UserService();
