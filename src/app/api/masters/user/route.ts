import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { auth } from "@/auth";

export async function GET(request: Request): Promise<Response> {
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

  // Connect to the Database
  await dbConnect();

  try {
    // Get all Users
    const users = await UserModel.find({});

    const final_users = users.map((item) => {
      return {
        fullName: item.fullName,
        username: item.username,
        email: item.email,
        isVerified: item.isVerified,
        verifyDateTime: item.verifyDateTime,
        pagePermissions: item.pagePermissions
      };
    });

    const response: ApiResponse = {
      success: true,
      message: "Users fetched successfully",
      statusCode: 200,
      data: final_users
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error in fetching users",
      statusCode: 500,
      data: error
    };

    return Response.json(response);
  }
}
