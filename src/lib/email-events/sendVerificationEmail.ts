import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verification-email";
import { ApiResponse } from "@/types/ApiResponse";
import { COMPANY_ERP_EMAIL } from "@/constants";

export async function sendVerificationEmail(
  email: string,
  username: string,
  fullName: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log(COMPANY_ERP_EMAIL, email);
  try {
    const { data, error } = await resend.emails.send({
      from: COMPANY_ERP_EMAIL,
      to: email,
      subject: "Pragati Logistics | Email Verification",
      react: VerificationEmail({ username, fullName, otp: verifyCode })
    });

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Error sending verification email",
        data: error
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Verification email sent",
      data
    };
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
    return {
      success: false,
      statusCode: 500,
      message: "Error sending verification email"
    };
  }
}
