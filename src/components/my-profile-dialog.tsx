import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useUserContext from "@/contexts/UserContext";

function MyProfileDialog() {
  const { userContext, setUserContext } = useUserContext();

  const lastUpdatedDateTime_str = new Date(
    userContext.lastVerifyDateTime
  ).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          My Profile
        </DialogTitle>
        <DialogDescription>
          Here is the information we have on you.
        </DialogDescription>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={userContext.fullName}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={userContext.username}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={userContext.email}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastVerifyDateTime" className="text-right">
              Verified On
            </Label>
            <Input
              id="lastVerifyDateTime"
              value={lastUpdatedDateTime_str}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
      </DialogHeader>
      {/* <DialogFooter>
        <Button type="submit">Confirm</Button>
      </DialogFooter> */}
    </DialogContent>
  );
}

export default MyProfileDialog;
