// Host Company Information
export const COMPANY_NAME_OFFICIAL = "Pragati Logistics Pvt. Ltd.";
export const COMPANY_NAME_DISPLAY = "Pragati Logistics";
export const COMPANY_ERP_EMAIL = "erp@pragatilogistics.com";

import * as LucideIcons from "lucide-react";

// Define a type for the LucideIcons object
type SidebarOption = {
  id: string;
  name: string;
  url?: string;
  icon: keyof typeof LucideIcons;
  isMenu?: boolean;
  subMenu?: SidebarOption[];
};

// All Sidebar Options
export const ALL_SIDEBAR_OPTIONS: SidebarOption[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard"
  },
  {
    id: "menu_masters",
    name: "Masters",
    icon: "EarthLock",
    isMenu: true,
    subMenu: [
      {
        id: "masters_user",
        name: "User Master",
        url: "/master/user",
        icon: "Users"
      },
      {
        id: "masters_office",
        name: "Office Master",
        url: "/master/office",
        icon: "Building"
      }
    ]
  }
];

// export const ALL_SIDEBAR_LINKS = [{
//     optionName: "Dashboard",
//     icon: <LayoutDashboard size={20} />,
//     url: "/dashboard",
//     selected: false
//   }];
