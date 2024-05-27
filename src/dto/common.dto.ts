import { z, object, string } from "zod";

export const usernameValidation = z
  .string()
  .min(1, "Username cannot be empty")
  .max(32, "Username must be less than 32 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .transform((val) => val.trim().toLowerCase()); // This line trims the input;

export const passwordValidation = z
  .string()
  .min(1, "Password cannot be empty")
  .max(32, "Password must be less than 32 characters");

export const emailValidation = z
  .string()
  .email("Invalid email")
  .max(75, "Email must be less than 75 characters")
  .transform((val) => val.trim()); // This line trims the input;

export const fullNameValidation = z
  .string()
  .min(2, "Full name must be more than 2 characters")
  .max(32, "Full name must be less than 32 characters")
  .transform((val) => val.trim()); // This line trims the input;
