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
  public async findByEmail(email: string) {
    return await Managers.findOne({ email }).exec();
  }

  public async updateStatus(
    manager_id: number,
    is_active: boolean,
  ): Promise<IManager> {
    const manager = await Managers.findOneAndUpdate(
      { manager_id },
      { is_active },
      { new: true },
    );

    if (!manager) {
      throw new Error("Manager not found");
    }

    return manager;
  }

  public async updateLastLogin(manager_id: number): Promise<IManager> {
    const manager = await Managers.findOneAndUpdate(
      { manager_id },
      { last_login: new Date().toISOString() }, // зберігаємо у форматі ISO
      { new: true },
    );

    if (!manager) {
      throw new Error("Manager not found");
    }

    return manager;
  }
}
export const managerRepository = new ManagerRepository();
