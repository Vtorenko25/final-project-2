import { adminRepository } from "../repositories/admin.repository";

class AdminService {
  public async getAdminByEmail(email: string) {
    return await adminRepository.findByEmail(email);
  }
}

export const adminService = new AdminService();
