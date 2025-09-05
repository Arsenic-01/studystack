import React from "react";
import Header from "./Header";
import { getCurrentUser } from "@/lib/auth";

const HeaderProvider = async () => {
  const user = await getCurrentUser();

  return <Header serverUser={user} />;
};

export default HeaderProvider;
