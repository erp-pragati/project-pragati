"use client";
import { CircleCheck, CircleX } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  fullName: string;
  username: string;
  email: string;
  isVerified: boolean;
  verifyDateTime: Date;
  pagePermissions: {
    admin: [string] | [];
    user: [string] | [];
  };
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name"
  },
  {
    accessorKey: "username",
    header: "Username"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "isVerified",
    header: "Verified?",
    cell: ({ getValue }) => {
      return getValue() ? <CircleCheck /> : <CircleX />;
    }
  },
  {
    accessorKey: "verifyDateTime",
    header: "Verified On"
  }
];
