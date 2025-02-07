import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DBConnect } from "@/utils/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await DBConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && (await user.comparePassword(credentials.password))) {
          return { id: user._id, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        await DBConnect();
        const user = await User.findOne({ email: session.user.email }).lean();
        if (user) {
          session.user.id = user._id.toString();
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
