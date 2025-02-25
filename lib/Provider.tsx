import React from "react";
import { auth } from "@/lib/auth";

const Provider = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <>
      {/* <div>User: {session?.user.email ?? "Not Logged In"}</div> */}
      {children}
    </>
  );
};

export default Provider;
