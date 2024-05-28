import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";

type UserContextProviderProps = {
  children: React.ReactNode;
};

type UserContextType = {
  userContext: UserContextObjectType;
  setUserContext: (inputObj: UserContextObjectType) => void;
};

type UserContextObjectType = {
  username: string;
  fullName: string;
  email: string;
  lastVerifyDateTime: Date;
  pagePermissions: { admin: [string] | []; user: [string] | [] };
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: UserContextProviderProps) {
  let userContext: UserContextObjectType = {
    username: "",
    fullName: "",
    email: "",
    lastVerifyDateTime: new Date(),
    pagePermissions: { admin: [], user: [] }
  };

  const setUserContext = (inputObj: UserContextObjectType) => {
    Object.assign(userContext, inputObj);
  };

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}
