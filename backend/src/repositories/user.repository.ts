import { FilterQuery } from "mongoose";

import {
  IUser,
  IUserListQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAllUsers(query: IUserListQuery): Promise<[IUser[], number]> {
    const filterObj: FilterQuery<IUser> = {};
    if (query.search) {
      filterObj.name = { $regex: query.search, $options: "i" };
    }
    const skip = query.limit * (query.page - 1);
    return await Promise.all([
      User.find(filterObj).limit(query.limit).skip(skip),
      User.countDocuments(filterObj),
    ]);
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }
}

export const userRepository = new UserRepository();
