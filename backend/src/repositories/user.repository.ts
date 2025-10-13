import { FilterQuery } from "mongoose";

import { IUser, IUserListQuery } from "../interfaces/user.interface";
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

  public async getAllUsersStatistic(): Promise<Record<string, number>> {
    const total = await User.countDocuments();
    const agree = await User.countDocuments({ status: "Aggre" });
    const inWork = await User.countDocuments({ status: "In Work" });
    const disagree = await User.countDocuments({ status: "Disaggre" });
    const dubbing = await User.countDocuments({ status: "Dubbing" });
    const newUsers = await User.countDocuments({ status: "New" });

    return { total, agree, inWork, disagree, dubbing, new: newUsers };
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }
}

export const userRepository = new UserRepository();
