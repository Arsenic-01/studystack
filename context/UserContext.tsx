// UserContext.tsx
"use client";
import React, { useState, createContext } from "react";

interface UserContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
