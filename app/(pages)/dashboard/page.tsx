import React from "react";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar/Navbar";

const Dashboard = async () => {
  const session = await auth();
  return (
    <>
      <div className="bg-[#171717] w-screen h-screen text-[#fcff5d]">
        <Navbar />
      </div>

      {/* <div>Dashboard {session?.user?.email}</div>; */}
    </>
  );
};

export default Dashboard;
