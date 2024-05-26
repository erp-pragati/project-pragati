import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/dto/common.dto";
import { ApiResponse } from "@/types/ApiResponse";

export async function GET(request: Request) {
  let url = request.url;
  // Connect to the database
  await dbConnect();

  try {
    // Extract the username from the query parameters
    const { searchParams } = new URL(url);

    // If the searchParams doesn't have "username", throw an error
    if (!searchParams.has("username")) {
      const response: ApiResponse = {
        success: false,
        message: "Username is required.",
        statusCode: 400
      };
      return Response.json(response);
    }

    // If the searchParams has "username", validate it
    const inputUsername = searchParams.get("username");

    // Validate the query parameters using Zod
    const result = usernameValidation.safeParse(inputUsername);

    // If the validation fails, throw an error
    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: "Username Validation Error",
        statusCode: 400
      };
    }

    // Find a verified user with the same username
    const username = result?.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true
    });

    // If existingVerifiedUser exists, throw an error
    if (existingVerifiedUser) {
      const response: ApiResponse = {
        success: false,
        message: "Username already exists.",
        statusCode: 400
      };
      return Response.json(response);
    }
    // If existingVerifiedUser does not exist, return success
    else {
      const response: ApiResponse = {
        success: true,
        message: "Username available.",
        statusCode: 200
      };
      return Response.json(response);
    }
  } catch (error) {
    console.log(`Error checking username: ${error}`);
    const response: ApiResponse = {
      success: false,
      message: "Error checking username",
      statusCode: 500,
      data: {
        showMessage: {
          header: "Error",
          message: "Error checking username. Please contact support."
        }
      }
    };
    return Response.json(response);
  }
}
