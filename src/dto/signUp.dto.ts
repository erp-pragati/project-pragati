import { object } from "zod";
import {
  usernameValidation,
  emailValidation,
  fullNameValidation
} from "@/dto/common.dto";

export const signUpSchema = object({
  username: usernameValidation,
  fullName: fullNameValidation,
  email: emailValidation
});
