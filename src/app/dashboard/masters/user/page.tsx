"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserMasters } from "./actions";
import { useSession } from "next-auth/react";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader2 } from "lucide-react";

export default function Page() {
  const session = useSession();
  // Define the Query to fetch User Masters
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["master_user"],
    queryFn: () => getUserMasters(),
    enabled: session.status === "authenticated"
  });

  if (data) {
    console.log(data);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          User Master
        </h1>
      </div>
      <div
        x-chunk="An empty state showing no products with a heading, description and a call to action to add a product."
        className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="w-full p-2">
          {!isLoading && <DataTable columns={columns} data={data.data} />}
        </div>

        {/* <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no Dashboard Blocks
          </h3>
          <p className="text-sm text-muted-foreground">
            Contact support to get access permissions.
          </p>
          <Button className="mt-4">Add Product</Button>
        </div> */}
      </div>
    </main>
  );
}
