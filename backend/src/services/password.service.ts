import * as bcrypt from "bcrypt";

class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();
