import joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { OrderEnum } from "../enums/order.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";

export class UserValidator {
  private static name = joi.string().min(1).max(50).trim();
  private static surname = joi.string().min(1).max(50).trim();
  private static email = joi.string().regex(regexConstant.EMAIL).trim();
  private static phone = joi.string().regex(regexConstant.PHONE).trim();
  private static age = joi.number().min(18).max(200);
  private static course = joi.string().min(3).max(10).trim();
  private static course_format = joi.string().min(3).max(20).trim();
  private static course_type = joi.string().min(3).max(20).trim();
  private static status = joi.string().min(3).max(20).trim();
  private static sum = joi.string().min(3).max(20).trim();
  private static already_paid = joi.string().min(3).max(20).trim();
  private static manager = joi.string().min(3).max(20).trim();
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();
  private static group = joi.string().min(3).max(10).trim();
  private static startDate = joi.date().iso();
  private static endDate = joi.date().iso();

  public static create = joi.object({
    name: this.name.required(),
    age: this.age.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone.optional(),
  });

  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static update = joi.object({
    name: this.name,
    surname: this.surname,
    email: this.email.email,
    phone: this.phone,
    age: this.age,
    course: this.course,
    course_format: this.course_format,
    course_type: this.course_type,
    status: this.status,
    sum: this.sum,
    already_paid: this.already_paid,
    manager: this.manager,
    group: this.group,
  });

  public static listQuery = joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(25).default(25),
    order: joi.string().valid(...Object.values(OrderEnum)),
    orderBy: joi.string().valid(...Object.values(UserListOrderEnum)),

    name: this.name.optional(),
    surname: this.surname.optional(),
    email: this.email.optional(),
    phone: this.phone.optional(),
    age: this.age.optional(),
    course: this.course.optional(),
    course_format: this.course_format.optional(),
    course_type: this.course_type.optional(),
    status: this.status.optional(),
    group: this.group.optional(),
    myOnly: joi.string().optional(),
    startDate: this.startDate.optional(),
    endDate: this.endDate.optional(),
  });
}
