import { writeInFile } from "@/app/utils/file-system";
import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
  callbacks: {
    async session(params) {
      return params.session;
    },
    async signIn(params) {
      const token = params.account?.access_token ?? "";
      await writeInFile(token);
      return token.length > 0;
    },
  },
});

export { handler as GET, handler as POST };
