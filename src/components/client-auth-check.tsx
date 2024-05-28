import React from "react";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";

function ClientAuthCheck({ session, children }: any) {
  // Switch the session status
  switch (session.status) {
    // If the session is loading, show the loader
    case "loading":
      return (
        <div className="flex min-h-screen items-center justify-center">
          <LoaderCircle className="h-16 w-16 animate-spin" />
        </div>
      );
      break;
    // If the session is unauthenticated, redirect to the sign-in page
    case "unauthenticated":
      redirect("/sign-in");
      return;
      break;
    // If the session is authenticated, return the dashboard layout
    case "authenticated":
      return <>{children}</>;
      break;
  }
  return <div>ClientAuthCheck</div>;
}

export default ClientAuthCheck;
