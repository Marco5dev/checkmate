import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DBConnect } from "@/utils/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          await DBConnect();
          
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const avatarResponse = await fetch(profile.avatar_url);
            const avatarBuffer = await avatarResponse.arrayBuffer();
            const base64Avatar = Buffer.from(avatarBuffer).toString("base64");

            const newUser = new User({
              email: user.email,
              name: user.name,
              username: `user_${profile.id}`,
              provider: "github",
              avatar: {
                filename: `github-${profile.login}.jpg`,
                contentType: "image/jpeg",
                base64: base64Avatar,
                createdAt: new Date(),
              }
            });
            await newUser.save();
          }

          return true;
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session?.user) {
        await DBConnect();
        const user = await User.findOne({ email: session.user.email }).lean();
        
        if (user) {
          session.user = {
            ...session.user,
            id: user._id.toString(),
            username: user.username,
            description: user.description,
            avatar: user.avatar
          };
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
