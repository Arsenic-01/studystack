import { Spinner } from "@heroui/react";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
    </div>
  );
};

export default loading;
