// "use client";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Mail } from "lucide-react";
// import { useState } from "react";

// export default function Home() {
//   const [email, setEmail] = useState<null | String>(null);
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Handle form submission
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">
//             Sign up
//           </CardTitle>
//           <CardDescription className="text-center">
//             Enter your email to get started
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 name="email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="email@example.com"
//                 required
//                 className="w-full"
//               />
//             </div>
//             <Button type="submit" className="w-full">
//               <Mail className="mr-2 h-4 w-4" />
//               Sign up with Email
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React from "react";
import { auth } from "@/lib/auth";

const page = async () => {
  const session = await auth();
  return <div>Dashboard {session?.user?.email}</div>;
};

export default page;
