import { dbConnect } from "@/lib/dbConfig";
import { sendVerificationEmail } from "@/lib/email-events/sendVerificationEmail";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { signUpSchema } from "@/dto/signUp.dto";
import { verify } from "crypto";

export async function POST(request: Request): Promise<Response> {
  // Connect to the Database
  await dbConnect();

  try {
    // Extract the username, password, and email from the request body
    const { username, fullName, email } = await request.json();

    // Check if a user with the same email already exists
    const existingUserWithSameEmail = await UserModel.findOne({ email });

    // If a user with the same email already exists, throw an error
    if (existingUserWithSameEmail) {
      const response: ApiResponse = {
        success: false,
        message: "User with same email already exists",
        statusCode: 400,
        data: {
          showMessage: {
            header: "User Already Exists",
            message: "Contact us to get reverified and set a new password."
          }
        }
      };
      return Response.json(response);
    }

    // Check if a user with the same username already exists
    const existingUserWithSameUsername = await UserModel.findOne({ username });

    // If a user with the same username already exists
    if (existingUserWithSameUsername) {
      // If the user is already verified, throw an error
      if (existingUserWithSameUsername.isVerified) {
        const response: ApiResponse = {
          success: false,
          message: "User with same username already exists",
          statusCode: 400,
          data: {
            showMessage: {
              header: "Username Already Exists",
              message:
                "This username already exists. Please choose a different username."
            }
          }
        };
        return Response.json(response);
      }
      // If the user is not verified, add a random 4 character string to the existing unverified username
      else {
        const randomString = Math.random().toString(36).substring(2, 6);
        const newUsername = `${existingUserWithSameUsername.username}_${randomString}`;
        await UserModel.updateOne(
          { _id: existingUserWithSameUsername._id },
          { $set: { username: newUsername } }
        );
      }
    }

    // Generate a random 6 digit number as the verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set the expiry of this verification code in 1 hour
    const verifyTokenExpiry = new Date();
    verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

    // Create a new user
    const newUser = new UserModel({
      username,
      fullName,
      email,
      password: "Awaiting Verification",
      verifyToken: verifyCode,
      verifyTokenExpiry,
      pagePermissions: {
        user: ["dashboard"],
        admin: []
      }
    });

    // Save the new user
    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      fullName,
      verifyCode
    );
    console.log(emailResponse);

    // If the emailResponse was not successful, throw an error
    if (!emailResponse.success) {
      const response: ApiResponse = {
        success: false,
        message: "Error sending verification email",
        statusCode: 500,
        data: {
          showMessage: {
            header: "Error",
            message: "An error occurred while sending verification email."
          }
        }
      };
      return Response.json(response);
    }

    // Return success response
    const response: ApiResponse = {
      success: true,
      message: "User registered successfully",
      statusCode: 200,
      data: {
        username,
        showMessage: {
          header: "User Registered",
          message: "Please check your email to verify your account."
        }
      }
    };
    return Response.json(response);
  } catch (error) {
    console.log(`Error registering user: ${error}`);
    const response: ApiResponse = {
      success: false,
      message: "Error registering user",
      statusCode: 500
    };
    return Response.json(response);
  }
}
