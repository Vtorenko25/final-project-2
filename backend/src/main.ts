import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { ApiError } from "./errors/api.error";
import { authRouter } from "./routes/auth.router";
import { userRouter } from "./routes/user.router";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use("/users", userRouter);

app.use("/auth", authRouter);

app.use("*", (req, res, next) => {
  next(new ApiError("Route not found", 404));
});

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message ?? "Something went wrong";

  res.status(status).json({ status, message });
});

app.listen(config.port, async () => {
  await mongoose.connect(config.mongoUrl);
  console.log(`Server has been started on port ${config.port}`);
});
