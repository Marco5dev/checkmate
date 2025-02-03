import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DBConnect } from "@/utils/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/User"; // Import the User model directly

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await DBConnect();
        try {
          // Add .select('+password') to include the password field
          const user = await User.findOne({ email: credentials.email })
            .select('+password');

          if (!user) {
            throw new Error("No user found with the email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Skip email verification for OAuth providers
        if (account?.provider !== "credentials") {
          await DBConnect();
          const existingUser = await User.findOne({ email: user.email });

          const githubPlatformData = {
            provider: 'github',
            username: profile.login,
            profileUrl: profile.html_url,
            connectedAt: new Date()
          };

          if (!existingUser) {
            // Get avatar data from GitHub
            const avatarResponse = await fetch(profile.avatar_url);
            const avatarBuffer = await avatarResponse.arrayBuffer();
            const base64Avatar = Buffer.from(avatarBuffer).toString("base64");

            const newUser = new User({
              email: user.email,
              name: user.name,
              username: `user_${profile.id}`,
              password: "",
              password_changes: 0,
              provider: "github",
              emailVerified: new Date(),
              verificationToken: null,
              verificationTokenExpires: null,
              avatar: {
                filename: `github-${profile.login}.jpg`,
                contentType: "image/jpeg",
                base64: base64Avatar,
                createdAt: new Date(),
              },
              connectedPlatforms: [githubPlatformData]
            });
            await newUser.save();
          } else {
            // Ensure existing user has password_changes field
            if (typeof existingUser.password_changes === 'undefined') {
              existingUser.password_changes = existingUser.password ? 1 : 0;
            }

            // Update existing user's GitHub platform data
            const platformIndex = existingUser.connectedPlatforms.findIndex(
              p => p.provider === 'github'
            );

            if (platformIndex === -1) {
              existingUser.connectedPlatforms.push(githubPlatformData);
            } else {
              existingUser.connectedPlatforms[platformIndex] = githubPlatformData;
            }

            // Update avatar if not exists
            if (!existingUser.avatar?.base64) {
              const avatarResponse = await fetch(profile.avatar_url);
              const avatarBuffer = await avatarResponse.arrayBuffer();
              const base64Avatar = Buffer.from(avatarBuffer).toString("base64");

              existingUser.avatar = {
                filename: `github-${profile.login}.jpg`,
                contentType: "image/jpeg",
                base64: base64Avatar,
                createdAt: new Date(),
              };
            }

            await existingUser.save();
          }

          // Make sure to return the avatar data
          if (existingUser) {
            user.avatar = existingUser.avatar;
          }
          return true;
        }

        // Check email verification for credentials provider
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser?.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        throw error;
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        await DBConnect();
        const user = await User.findOne({ email: session.user.email })
          .select('+password +password_changes')
          .lean();
        
        if (user) {
          session.user = {
            ...session.user,
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar ? {
              base64: user.avatar.base64,
              contentType: user.avatar.contentType,
              filename: user.avatar.filename,
              createdAt: user.avatar.createdAt
            } : null,
            hasPassword: user.password_changes > 0,
            password_changes: user.password_changes,
            provider: user.provider,
            connectedPlatforms: user.connectedPlatforms.map(platform => ({
              provider: platform.provider,
              username: platform.username,
              profileUrl: platform.profileUrl,
              connectedAt: platform.connectedAt
            }))
          };
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// This prevents the error by ensuring DB connection before handler
await DBConnect();

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
