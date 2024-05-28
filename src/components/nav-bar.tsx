import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { filterSidebarOptions } from "@/app/dashboard/actions";
import { ALL_SIDEBAR_OPTIONS } from "@/constants";
import Icon from "./icon-helper";

function Navbar({
  pagePermissions
}: {
  pagePermissions: { admin: [string] | []; user: [string] | [] };
}) {
  // Use pagePermissions object to generate the array of page IDs to be loaded
  const arr_pagesAllowedToAccess = [
    ...pagePermissions?.admin,
    ...pagePermissions?.user,
    "dashboard"
  ];

  const filteredSidebarOptions = filterSidebarOptions(
    ALL_SIDEBAR_OPTIONS,
    arr_pagesAllowedToAccess
  );

  return (
    <nav>
      <Accordion
        type="single"
        collapsible
        className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4"
      >
        {filteredSidebarOptions.map((sidebarItem, index) => {
          if (sidebarItem.subMenu) {
            return (
              <AccordionItem key={sidebarItem.id} value={`item-${index}`}>
                <AccordionTrigger
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  // {
                  //   sidebarItem.selected
                  //     ? "flex w-full items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  //     : "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  // }
                >
                  <Icon name={sidebarItem.icon} />
                  {sidebarItem.name}
                </AccordionTrigger>
                <AccordionContent className="mt-2 flex flex-col gap-2">
                  {sidebarItem.subMenu.map((subMenu) => {
                    return (
                      <Link
                        href={subMenu.url || ""}
                        key={subMenu.id}
                        className="flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                        // {
                        //   subMenu.selected
                        //     ? "flex items-center gap-3 rounded-lg bg-muted px-10 py-2 text-primary transition-all hover:text-primary"
                        //     : "flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                        // }
                      >
                        <Icon name={subMenu.icon} />
                        {subMenu.name}
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          }
          if (sidebarItem.url) {
            return (
              <Link
                href={sidebarItem.url}
                key={sidebarItem.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                // {
                //   sidebarItem.selected
                //     ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                //     : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                // }
              >
                <Icon name={sidebarItem.icon} />
                {sidebarItem.name}
              </Link>
            );
          }
        })}
      </Accordion>
    </nav>
  );
}

export default Navbar;
