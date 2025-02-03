import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { usersDBConnect } from "@/utils/mongodb";
import User from "@/model/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await usersDBConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && (await user.comparePassword(credentials.password))) {
          return { id: user._id, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
