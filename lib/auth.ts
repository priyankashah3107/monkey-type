import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { html, text } from "@/lib/authSendRequest";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.EMAIL_FROM!,

      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { from },
      }) {
        // your function
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: email,
            subject: `Sign in to your app`,
            // html: html({ url, host: "shahpriyanka9971@gmail.com", theme: "" }),
            // text: text({ url, host: "shahpriyanka9971@gmail.com" }),
            html: html({ url, host: new URL(url).hostname }),
            text: text({ url, host: new URL(url).hostname }),
          }),
        });

        const data = await res.json();
        console.log("Resend Response:", data);

        if (!res.ok) {
          throw new Error("Resend error:" + JSON.stringify(await res.json()));
        }
      },

      async generateVerificationToken() {
        return crypto.randomUUID();
      },

      normalizeIdentifier(identifier: string): string {
        // // Get the first two elements only,
        // // separated by `@` from user input.
        // let [local, domain] = identifier.toLowerCase().trim().split("@");
        // // The part before "@" can contain a ","
        // // but we remove it on the domain part
        // domain = domain.split(",")[0];
        // return `${local}@${domain}`;

        const parts = identifier.toLowerCase().trim().split("@");
        if (parts.length !== 2) throw new Error("Invalid email format");
        return `${parts[0]}@${parts[1].split(",")[0]}`;

        // You can also throw an error, which will redirect the user
        // to the sign-in page with error=EmailSignin in the URL
        // if (identifier.split("@").length > 2) {
        //   throw new Error("Only one email allowed")
        // }
      },
    }),
  ],

  // when u use this session then we store the session in the db
  // callbacks: {
  //   async session({ session, user }) {
  //     session.user.id = user.id;
  //     return session;
  //   },
  // },

  // session: {
  //   strategy: "jwt", // Use JWT-based sessions
  // },

  // callbacks: {
  //   async jwt({ token, user }) {
  //     // Add user ID and email to the JWT token
  //     if (user) {
  //       token.id = user.id;
  //       token.email = user.email;
  //     }
  //     return token;
  //   },
  //   // async session({ session, token, user }) {
  //   //   // Attach JWT token details to the session
  //   //   session.user.id = user.id;
  //   //   session.user.email = user.email;
  //   //   // session.token = token;
  //   //   return session;
  //   // },

  //   async session({ session, user }) {
  //     session.user.id = user.id;
  //     return session;
  //   },
  // },

  session: {
    strategy: "jwt",
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.isVerified = user.isVerified;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.token = token;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
});
