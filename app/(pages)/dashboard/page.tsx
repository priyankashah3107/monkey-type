import React from "react";
import { auth } from "@/lib/auth";

const Dashboard = async () => {
  const session = await auth();
  return <div>Dashboard {session?.user?.email}</div>;
};

export default Dashboard;
