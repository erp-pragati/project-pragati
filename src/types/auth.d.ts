import "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id: string;
    username: string;
    fullName: string;
    isVerified: boolean;
  }

  interface Session {
    user: {
      _id: string;
      username: string;
      fullName: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    fullName: string;
    isVerified: boolean;
  }
}
