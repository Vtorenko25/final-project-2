import { FilterQuery } from "mongoose";

import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAllUsers(query: IUserListQuery): Promise<[IUser[], number]> {
    const filterObj: FilterQuery<IUser> = {};

    if (query.name) filterObj.name = { $regex: query.name, $options: "i" };
    if (query.surname)
      filterObj.surname = { $regex: query.surname, $options: "i" };
    if (query.email) filterObj.email = { $regex: query.email, $options: "i" };
    if (query.phone) filterObj.phone = { $regex: query.phone, $options: "i" };
    if (query.age) filterObj.age = Number(query.age);
    if (query.course)
      filterObj.course = { $regex: query.course, $options: "i" };
    if (query.course_format)
      filterObj.course_format = { $regex: query.course_format, $options: "i" };
    if (query.course_type)
      filterObj.course_type = { $regex: query.course_type, $options: "i" };
    if (query.status) filterObj.status = query.status;
    if (query.group) filterObj.group = query.group;
    if (query.myOnly) filterObj.manager = query.myOnly; // можна передавати роль менеджера

    if (query.startDate && query.endDate) {
      filterObj.created_at = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const limit = query.limit || 25;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    if (query.orderBy) sort[query.orderBy] = query.order === "asc" ? 1 : -1;
    else sort.created_at = -1;

    const [users, total] = await Promise.all([
      User.find(filterObj).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filterObj),
    ]);

    return [users, total];
  }

  public async getAllUsersStatistic(): Promise<Record<string, number>> {
    const total = await User.countDocuments();
    const agree = await User.countDocuments({ status: "Agree" });
    const inWork = await User.countDocuments({ status: "In Work" });
    const disagree = await User.countDocuments({ status: "Disagree" });
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
