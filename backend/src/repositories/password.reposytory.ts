import { IManager } from "../interfaces/manager.interface";
import { Managers } from "../models/manager.model";

class PasswordRepository {
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
  }
}
export const passwordRepository = new PasswordRepository();
