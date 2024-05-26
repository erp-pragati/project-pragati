import { z } from "zod";
import { usernameValidation, passwordValidation } from "@/dto/common.dto";

export const verifyCodeValidation = z.string();
// .length(6, "OTP must be 6 digits long.");

// In this use case, only the username is required because this is a multi-step form
export const verifyCodeSchema = z
  .object({
    username: usernameValidation,
    verifyCode: z.union([verifyCodeValidation, z.null()]),
    password: z.union([passwordValidation, z.null()]),
    repeatPassword: z.union([passwordValidation, z.null()])
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match.",
    path: ["repeatPassword"]
  });
