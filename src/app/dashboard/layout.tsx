"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import User from "@/models/User.model";
import { COMPANY_NAME_DISPLAY } from "@/constants";
import Navbar from "@/components/nav-bar";
import { useQuery } from "@tanstack/react-query";
import ClientAuthCheck from "@/components/client-auth-check";
import TopBar from "@/components/top-bar";
import { getInitialLoadData } from "./actions";
import useUserContext from "@/contexts/UserContext";
import Icon from "@/components/icon-helper";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load the theme, router and session
  const { userContext, setUserContext } = useUserContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const session = useSession();

  // Define the Query to check if the username is unique that will run only if the username is authenticated
  const {
    data: initialLoadData,
    error: initialLoadError,
    isLoading: initialIsLoading,
    isError: initialLoadingIsError
  } = useQuery({
    queryKey: ["initial-load", session.data?.user.username],
    queryFn: () => getInitialLoadData(session.data?.user.username || ""),
    enabled: session.status === "authenticated"
  });

  if (initialLoadData) {
    setUserContext(initialLoadData.data.userContext);
  }
  return (
    <ClientAuthCheck session={session}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                {/* <Package2 className="h-6 w-6" /> */}
                <Icon name="Package2" />
                <span className="">{COMPANY_NAME_DISPLAY}</span>
              </Link>
              {/* <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto h-8 w-8"
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button> */}
            </div>
            <div>
              <Navbar pagePermissions={userContext?.pagePermissions} />
            </div>
            {/* <div className="mt-auto p-4">
                <Card x-chunk="A card with a call to action">
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div> */}
          </div>
        </div>
        <div className="flex flex-col">
          <TopBar />
          {children}
        </div>
      </div>
    </ClientAuthCheck>
  );

  // // Switch the session status
  // switch (session.status) {
  //   // If the session is loading, show the loader
  //   case "loading":
  //     return (
  //       <div className="flex min-h-screen items-center justify-center">
  //         <LoaderCircle className="h-16 w-16 animate-spin" />
  //       </div>
  //     );
  //     break;
  //   // If the session is unauthenticated, redirect to the sign-in page
  //   case "unauthenticated":
  //     redirect("/sign-in");
  //     break;
  //   // If the session is authenticated, return the dashboard layout
  //   case "authenticated":
  //     const authenticatedUser = session.data?.user;

  //     // Define the Query to check if the username is unique that will run only if the username is authenticated
  //     // const {
  //     //   data: initialLoadData,
  //     //   error: initialLoadError,
  //     //   isLoading: initialIsLoading,
  //     //   isError: initialLoadingIsError
  //     // } = useQuery({
  //     //   queryKey: ["initial-load", authenticatedUser],
  //     //   //queryFn: () => getInitialLoadData(username),
  //     //   enabled: session.status === "authenticated"
  //     // });

  //     console.log(authenticatedUser.username);

  // return (
  //   <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
  //     <div className="hidden border-r bg-muted/40 md:block">
  //       <div className="flex h-full max-h-screen flex-col gap-2">
  //         <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
  //           <Link
  //             href="/"
  //             className="flex items-center gap-2 font-semibold"
  //           >
  //             <Package2 className="h-6 w-6" />
  //             <span className="">{COMPANY_NAME_DISPLAY}</span>
  //           </Link>
  //           {/* <Button
  //             variant="outline"
  //             size="icon"
  //             className="ml-auto h-8 w-8"
  //           >
  //             <Bell className="h-4 w-4" />
  //             <span className="sr-only">Toggle notifications</span>
  //           </Button> */}
  //         </div>
  //         <div>
  //           <Navbar />
  //         </div>
  //         {/* <div className="mt-auto p-4">
  //           <Card x-chunk="A card with a call to action">
  //             <CardHeader className="p-2 pt-0 md:p-4">
  //               <CardTitle>Upgrade to Pro</CardTitle>
  //               <CardDescription>
  //                 Unlock all features and get unlimited access to our
  //                 support team.
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
  //               <Button size="sm" className="w-full">
  //                 Upgrade
  //               </Button>
  //             </CardContent>
  //           </Card>
  //         </div> */}
  //       </div>
  //     </div>
  //     <div className="flex flex-col">
  //       <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
  //         <Sheet>
  //           <SheetTrigger asChild>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="shrink-0 md:hidden"
  //             >
  //               <Menu className="h-5 w-5" />
  //               <span className="sr-only">Toggle navigation menu</span>
  //             </Button>
  //           </SheetTrigger>
  //           <SheetContent side="left" className="flex flex-col">
  //             <Link
  //               href="/"
  //               className="mb-6 flex items-center gap-2 font-semibold"
  //             >
  //               <Package2 className="h-6 w-6" />
  //               <span className="">{COMPANY_NAME_DISPLAY}</span>
  //             </Link>
  //             <Navbar />
  //             {/* <div className="mt-auto">
  //               <Card>
  //                 <CardHeader>
  //                   <CardTitle>Upgrade to Pro</CardTitle>
  //                   <CardDescription>
  //                     Unlock all features and get unlimited access to our
  //                     support team.
  //                   </CardDescription>
  //                 </CardHeader>
  //                 <CardContent>
  //                   <Button size="sm" className="w-full">
  //                     Upgrade
  //                   </Button>
  //                 </CardContent>
  //               </Card>
  //             </div> */}
  //           </SheetContent>
  //         </Sheet>
  //         <div className="w-full flex-1">
  //           <form>
  //             <div className="relative">
  //               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  //               <Input
  //                 type="search"
  //                 placeholder="Search products..."
  //                 className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
  //               />
  //             </div>
  //           </form>
  //         </div>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button
  //               variant="secondary"
  //               size="icon"
  //               className="rounded-full"
  //             >
  //               <CircleUser className="h-5 w-5" />
  //               <span className="sr-only">Toggle user menu</span>
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem
  //               onClick={(): void => {
  //                 setTheme(theme === "dark" ? "light" : "dark");
  //               }}
  //             >
  //               Toggle Theme
  //             </DropdownMenuItem>
  //             <DropdownMenuItem>Settings</DropdownMenuItem>
  //             <DropdownMenuItem>Support</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => signOut()}>
  //               Logout
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </header>
  //       {children}
  //     </div>
  //   </div>
  // );
  // }
}
