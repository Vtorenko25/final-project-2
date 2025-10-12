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

  public async findById(manager_id: number): Promise<IManager | null> {
    return await Managers.findOne({ manager_id });
  }
}
export const managerRepository = new ManagerRepository();
