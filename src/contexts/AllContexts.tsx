import React from "react";
import { UserContextProvider } from "./UserContext";

function AllContexts({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserContextProvider>{children}</UserContextProvider>;
}

export default AllContexts;
