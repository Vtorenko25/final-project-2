import { FilterQuery } from "mongoose";

import { IManager, IManagerListQuery } from "../interfaces/manager.interface";
import { Managers } from "../models/manager.model";

class ManagerRepository {
  public async create(dto: IManager): Promise<IManager> {
    return await Managers.create(dto);
  }

  public async getManager(
    query: IManagerListQuery,
  ): Promise<[IManager[], number]> {
    const filterObj: FilterQuery<IManager> = {};
    if (query.search) {
      filterObj.name = { $regex: query.search, $options: "i" };
    }
    const skip = query.limit * (query.page - 1);
    const [managers, total] = await Promise.all([
      Managers.find(filterObj).limit(query.limit).skip(skip),
      Managers.countDocuments(filterObj),
    ]);

    return [managers, total];
  }

  public async findById(manager_id: string | number): Promise<IManager | null> {
    if (typeof manager_id === "string" && manager_id.length === 24) {
      return await Managers.findById(manager_id);
    }
    return await Managers.findOne({ manager_id: Number(manager_id) });
  }
  public async updatePassword(
    manager_id: number,
    password: string,
  ): Promise<IManager> {
    const updated = await Managers.findOneAndUpdate(
      { manager_id },
      { password },
      { new: true },
    );
    if (!updated) {
      throw new Error("Manager not found");
    }
    return updated;
  };

  public async findByEmail(email: string) {
    return await Managers.findOne({ email }).exec();
  }
}
export const managerRepository = new ManagerRepository();
