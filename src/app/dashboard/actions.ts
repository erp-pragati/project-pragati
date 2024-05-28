import axios from "axios";
import * as LucideIcons from "lucide-react";

export async function getInitialLoadData(username: string) {
  const { data: responseData } = await axios.get(
    `/api/initial-load-data?username=${username}`
  );
  return responseData;
}

export async function submitSignUpData(inputData: any) {
  const { data: responseData } = await axios.post("/api/sign-up", inputData);
  return responseData;
}

// Function that takes in ALL_SIDEBAR_OPTIONS and arr_pagesAllowedToAccess to give us the final sidebar object
type SidebarOption = {
  id: string;
  name: string;
  url?: string;
  icon: keyof typeof LucideIcons;
  isMenu?: boolean;
  subMenu?: SidebarOption[];
};

export function filterSidebarOptions(
  options: SidebarOption[],
  allowedPages: string[]
): SidebarOption[] {
  return options
    .map((option) => {
      if (option.isMenu && option.subMenu) {
        const filteredSubMenu = filterSidebarOptions(
          option.subMenu,
          allowedPages
        );
        if (filteredSubMenu.length > 0) {
          return { ...option, subMenu: filteredSubMenu };
        } else {
          return null;
        }
      } else {
        return allowedPages.includes(option.id) ? option : null;
      }
    })
    .filter((option): option is SidebarOption => option !== null);
}
