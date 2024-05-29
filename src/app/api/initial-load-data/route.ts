import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { auth } from "@/auth";

export async function GET(request: Request) {
  let url = request.url;

  // Read User session (Authentication)
  const session = await auth();

  // If the session doesn't exist, throw an error
  if (!session) {
    const response: ApiResponse = {
      success: false,
      message: "Unauthenticated User",
      statusCode: 401
    };
    return Response.json(response);
  }

  // const allPagePermissions = session?.user.pagePermissions;

  // Connect to the database
  await dbConnect();

  try {
    // Extract the username from the query parameters
    const { searchParams } = new URL(url);

    // If the searchParams doesn't have "username", throw an error
    if (!searchParams.has("username")) {
      const response: ApiResponse = {
        success: false,
        message: "Username not found",
        statusCode: 400
      };
      return Response.json(response);
    }

    // Extract the username from the query parameters
    const inputUsername = searchParams.get("username");

    // Find the user with the given username
    const userToReturn = await UserModel.findOne({
      username: inputUsername
    });

    // If the user doesn't exist, throw an error
    if (!userToReturn) {
      const response: ApiResponse = {
        success: false,
        message: "User doesn't exist",
        statusCode: 400
      };
      return Response.json(response);
    }

    // If the user is found, create the return object
    const finalObject = {
      userContext: {
        fullName: userToReturn.fullName,
        username: userToReturn.username,
        email: userToReturn.email,
        lastVerifyDateTime: userToReturn.verifyDateTime,
        pagePermissions: userToReturn.pagePermissions
      },
      settingsContext: {}
    };

    const response: ApiResponse = {
      success: true,
      message: "User found",
      statusCode: 200,
      data: finalObject
    };

    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error occurred while sending initial load data.",
      statusCode: 500
    };
    return Response.json(response);
  }

  //     // If the searchParams has "username", validate it
  //     const inputUsername = searchParams.get("username");

  //     // Validate the query parameters using Zod
  //     const result = usernameValidation.safeParse(inputUsername);

  //     // If the validation fails, throw an error
  //     if (!result.success) {
  //       const response: ApiResponse = {
  //         success: false,
  //         message: "Username Validation Error",
  //         statusCode: 400
  //       };
  //     }

  //     // Find a verified user with the same username
  //     const username = result?.data;
  //     const existingVerifiedUser = await UserModel.findOne({
  //       username,
  //       isVerified: true
  //     });

  //     // If existingVerifiedUser exists, throw an error
  //     if (existingVerifiedUser) {
  //       const response: ApiResponse = {
  //         success: false,
  //         message: "Username already exists.",
  //         statusCode: 400
  //       };
  //       return Response.json(response);
  //     }
  //     // If existingVerifiedUser does not exist, return success
  //     else {
  //       const response: ApiResponse = {
  //         success: true,
  //         message: "Username available.",
  //         statusCode: 200
  //       };
  //       return Response.json(response);
  //     }
  //   } catch (error) {
  //     console.log(`Error checking username: ${error}`);
  //     const response: ApiResponse = {
  //       success: false,
  //       message: "Error checking username",
  //       statusCode: 500,
  //       data: {
  //         showMessage: {
  //           header: "Error",
  //           message: "Error checking username. Please contact support."
  //         }
  //       }
  //     };
  //     return Response.json(response);
  // }
}
