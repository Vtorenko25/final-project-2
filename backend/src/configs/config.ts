import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,

  mongoUrl:
    "mongodb+srv://olegvtorenko:uLQv5KYVoWHCfwSM@cluster0.ws6iz.mongodb.net/users",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};
