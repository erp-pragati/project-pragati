import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { verifyCodeSchema } from "@/dto/verifyCodeSchema.dto";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    // Extract the username from the query parameters
    const { searchParams } = new URL(request.url);

    // Create the input object from the URL parameters
    const inputObject = {
      username: decodeURIComponent(searchParams.get("username") || ""),
      verifyCode: searchParams.has("verifyCode")
        ? searchParams.get("verifyCode")
        : null,
      password: searchParams.has("password")
        ? searchParams.get("password")
        : null,
      repeatPassword: searchParams.has("repeatPassword")
        ? searchParams.get("repeatPassword")
        : null
    };

    // Validate the query parameters using Zod
    const result = verifyCodeSchema.safeParse(inputObject);

    // If the validation fails, throw an error
    if (!result.success) {
      const verifyEmailErrors = result.error.format().username?._errors || [];
      const response: ApiResponse = {
        success: false,
        message: "Validation Error",
        statusCode: 400,
        data: {
          verifyEmailErrors
        }
      };
      return Response.json(response);
    }

    // Find the user with the given username that needs verification
    const userToVerify = await UserModel.findOne({
      username: result.data.username,
      isVerified: false
    });

    // If userToVerify is not found, throw an error
    if (!userToVerify) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
        statusCode: 404,
        data: {
          showMessage: {
            header: "User not found",
            message:
              "This user either doesn't exist or is not awaiting verification."
          }
        }
      };
      return Response.json(response);
    }

    // If verifyCode, password and repeatPasssword are null, it means we only want to confirm if the username exists
    if (
      !result.data.verifyCode &&
      !result.data.password &&
      !result.data.repeatPassword
    ) {
      const response: ApiResponse = {
        success: true,
        message: "User found",
        statusCode: 200,
        data: {
          username: userToVerify.username,
          fullName: userToVerify.fullName
        }
      };
      return Response.json(response);
    }

    // If password and repeatPasssword are null, it means we only want to verify the code
    if (!result.data.password && !result.data.repeatPassword) {
      // Verify that the code matches and the expiry date is not expired
      const otpMatches = userToVerify.verifyToken === result.data.verifyCode;
      const otpNotExpired = new Date() < userToVerify.verifyTokenExpiry;

      // If the OTP does not match, throw an error
      if (!otpMatches) {
        const response: ApiResponse = {
          success: false,
          message: "Verification code mismatch",
          statusCode: 400,
          data: {
            showMessage: {
              header: "Incorrect OTP",
              message: "Please enter the correct OTP."
            }
          }
        };
        return Response.json(response);
      }

      // If the OTP is expired, throw an error
      if (!otpNotExpired) {
        const response: ApiResponse = {
          success: false,
          message: "Verification code expired",
          statusCode: 400,
          data: {
            showMessage: {
              header: "OTP Expired",
              message: "Please contact us to request a new verification email."
            }
          }
        };
        return Response.json(response);
      }

      const response: ApiResponse = {
        success: true,
        message: "Verification code match",
        statusCode: 200,
        data: {
          username: userToVerify.username,
          fullName: userToVerify.fullName,
          verifyCode: userToVerify.verifyCode,
          showMessage: {
            header: "OTP Verified",
            message: "Please enter a new password to complete verification."
          }
        }
      };
      return Response.json(response);
    }

    // If the user sends password and repeatPassword, send him a message regarding rerouting to POST
    const response: ApiResponse = {
      success: false,
      message: "Please reroute to POST",
      statusCode: 400
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal Server Error ('verify-email' GET route)",
      statusCode: 500
    };
    return Response.json(response);
  }
}

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    // Extract the username, password, and email from the request body
    const inputData = await request.json();

    // Validate the query parameters using Zod
    const result_post = verifyCodeSchema.safeParse(inputData);

    // If the validation fails, throw an error
    if (!result_post.success) {
      const response: ApiResponse = {
        success: false,
        message: "Data Validation Error",
        statusCode: 400,
        data: {
          showMessage: {
            header: "Data Validation Error",
            message: "Data Validation Error. Please contact support."
          }
        }
      };
      return Response.json(response);
    }

    // Find the user with the given username that needs verification
    const userToVerify = await UserModel.findOne({
      username: result_post.data.username,
      isVerified: false
    });

    // If userToVerify is not found, throw an error
    if (!userToVerify) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
        statusCode: 404
      };
      return Response.json(response);
    }

    // If verifyCode, password and repeatPasssword are null, it means we only want to confirm if the username exists
    if (
      !result_post.data.verifyCode &&
      !result_post.data.password &&
      !result_post.data.repeatPassword
    ) {
      const response: ApiResponse = {
        success: true,
        message: "User found",
        statusCode: 200,
        data: {
          username: userToVerify.username,
          fullName: userToVerify.fullName
        }
      };
      return Response.json(response);
    }

    // Verify that the code matches and the expiry date is not expired
    const otpMatches = userToVerify.verifyToken === result_post.data.verifyCode;
    const otpNotExpired = new Date() < userToVerify.verifyTokenExpiry;

    // If the OTP does not match, throw an error
    if (!otpMatches) {
      const response: ApiResponse = {
        success: false,
        message: "Verification code mismatch",
        statusCode: 400,
        data: {
          showMessage: {
            header: "Incorrect OTP",
            message: "Please enter the correct OTP."
          }
        }
      };
      return Response.json(response);
    }

    // If the OTP is expired, throw an error
    if (!otpNotExpired) {
      const response: ApiResponse = {
        success: false,
        message: "Verification code expired",
        statusCode: 400,
        data: {
          showMessage: {
            header: "OTP Expired",
            message: "Please contact us to request a new verification email."
          }
        }
      };
      return Response.json(response);
    }

    // If the password and repeatPassword don't match, throw an error
    if (result_post.data.password !== result_post.data.repeatPassword) {
      const response: ApiResponse = {
        success: false,
        message: "Passwords do not match",
        statusCode: 400,
        data: {
          showMessage: {
            header: "Passwords do not match",
            message: "Please enter the same password in both fields."
          }
        }
      };
      return Response.json(response);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      result_post.data.password || "",
      10
    );

    // Update the user's password
    userToVerify.password = hashedPassword;
    userToVerify.isVerified = true;
    userToVerify.verifyToken = null;
    userToVerify.verifyTokenExpiry = null;
    userToVerify.verifyDateTime = new Date();
    await userToVerify.save();

    // Send a success response
    const response: ApiResponse = {
      success: true,
      message: "User verified",
      statusCode: 200,
      data: {
        showMessage: {
          header: "User Verified",
          message: `Hello ${userToVerify.fullName}, your account has been verified.`
        }
      }
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal Server Error ('verify-email' GET route)",
      statusCode: 500
    };
    return Response.json(response);
  }
}
