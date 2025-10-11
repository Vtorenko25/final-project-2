import joi from "joi";

import { regexConstant } from "../constants/regex.constant";

export class ManagerValidator {
  private static name = joi.string().min(3).max(50).trim();
  private static surname = joi.string().min(3).max(50).trim();
  private static email = joi.string().regex(regexConstant.EMAIL).trim();

  public static create = joi.object({
    name: this.name.required(),
    surname: this.surname.required(),
    email: this.email.required(),
  });

  public static listQuery = joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(10).default(10),
    search: joi.string().trim(),
  });
}
