import axios from "axios";
import { verifyCodeSchema } from "@/dto/verifyCodeSchema.dto";
import { z } from "zod";

export async function sendVerificationData(
  inputObject: z.infer<typeof verifyCodeSchema>
) {
  const {
    username: inputUsername,
    verifyCode: inputOTP,
    password: inputPassword,
    repeatPassword: inputRepeatPassword
  } = inputObject;

  let finalURLParams = "?";
  if (inputUsername) finalURLParams += `username=${inputUsername}`;
  if (inputOTP) finalURLParams += `&verifyCode=${inputOTP}`;

  const { data: responseData } = await axios.get(
    `/api/verify-email${finalURLParams}`
  );
  return responseData;
}

export async function submitPasswordChange(
  inputObject: z.infer<typeof verifyCodeSchema>
) {
  const { data: responseData } = await axios.post(
    `/api/verify-email`,
    inputObject
  );
  return responseData;
}
