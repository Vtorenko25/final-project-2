import { AdminModel } from "../models/admin.model";

class AdminRepository {
  public async findByEmail(email: string) {
    return await AdminModel.findOne({ "admin.email": email }).exec();
  }
}

export const adminRepository = new AdminRepository();
