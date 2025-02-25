// this doc help me to solve this issue https://stackoverflow.com/questions/74471642/nextjs-13-button-onclick-event-handlers-cannot-be-passed-to-client-componen
// onclick  we can not use onClick in server component still async await issue
// also check react19 server fuctions
// https://react.dev/reference/rsc/server-functions

import React from "react";
import { auth, signOut } from "@/lib/auth";
import { BarChart, Keyboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = async () => {
  const session = await auth();

  // const handleSignout = () => {
  //   signOut();
  // };
  return (
    <>
      {!session ? (
        <nav className="flex flex-row justify-between px-10 py-6 items-center">
          <div className="flex flex-row gap-4">
            <h1 className="cursor-pointer font-bold text-2xl">MonkeyType</h1>
            <Keyboard className="cursor-pointer mt-2" />
          </div>
          <Link href={"/signin"} className="cursor-pointer">
            <User />
          </Link>
        </nav>
      ) : (
        <nav className="flex flex-row justify-between px-10 py-6 items-center">
          <div className="flex flex-row gap-4">
            <h1 className="cursor-pointer font-bold text-2xl">MonkeyType</h1>
            <Keyboard className="cursor-pointer mt-2" />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex flex-row gap-2">
                  <User />
                  <p>{session?.user.email}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <Link href={"/account"} className="flex flex-row gap-1">
                    <BarChart />
                    <p>User Stats</p>
                  </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="flex flex-row gap-1">
                      <LogOut />
                      Signout
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
