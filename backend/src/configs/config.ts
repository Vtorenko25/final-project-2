import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,

  // mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb",
  mongoUrl:
    "mongodb+srv://olegvtorenko:uLQv5KYVoWHCfwSM@cluster0.ws6iz.mongodb.net/users",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};
