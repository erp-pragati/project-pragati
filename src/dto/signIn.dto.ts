import { object } from "zod";
import { usernameValidation, passwordValidation } from "@/dto/common.dto";

export const signInSchema = object({
  username: usernameValidation,
  password: passwordValidation
});
