import { FilterQuery } from "mongoose";

import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAllUsers(query: IUserListQuery): Promise<[IUser[], number]> {
    // const skip = query.limit * (query.page - 1);
    // return await User.find().limit(query.limit).skip(skip);
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
}

export const userRepository = new UserRepository();
