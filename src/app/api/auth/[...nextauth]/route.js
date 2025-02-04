import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DBConnect } from "@/utils/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { getServerSession } from "next-auth"; 

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
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

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
    async signIn(params) {
      const { user, account, profile } = params;
      
      try {
        await DBConnect();

        if (account?.provider === "github") {
          const githubPlatformData = {
            provider: "github",
            username: profile.login,
            profileUrl: profile.html_url,
            connectedAt: new Date(),
          };

          // Check if this is a connection attempt using the profile page
          const isConnecting = params?.headers?.referer?.includes('/profile') || 
                             params?.req?.headers?.referer?.includes('/profile');

          if (isConnecting) {
            // Get current session using alternative method
            const currentSession = await getServerSession(
              params?.req || params?.headers, 
              params?.res || {}, 
              authOptions
            );
            
            if (!currentSession?.user?.email) {
              throw new Error("No authenticated user found");
            }

            // Find and update existing user
            const currentUser = await User.findOne({ email: currentSession.user.email });
            if (!currentUser) {
              throw new Error("Current user not found");
            }

            // Ensure connectedPlatforms exists
            if (!currentUser.connectedPlatforms) {
              currentUser.connectedPlatforms = [];
            }

            // Update GitHub platform data
            const platformIndex = currentUser.connectedPlatforms.findIndex(
              (p) => p.provider === "github"
            );

            if (platformIndex === -1) {
              currentUser.connectedPlatforms.push(githubPlatformData);
            } else {
              currentUser.connectedPlatforms[platformIndex] = githubPlatformData;
            }

            await currentUser.save();
            return false; // Keep existing session
          }

          // Normal GitHub sign in flow
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
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
              connectedPlatforms: [githubPlatformData],
            });
            await newUser.save();
          } else {
            if (typeof existingUser.password_changes === "undefined") {
              existingUser.password_changes = existingUser.password ? 1 : 0;
            }

            const platformIndex = existingUser.connectedPlatforms.findIndex(
              (p) => p.provider === "github"
            );

            if (platformIndex === -1) {
              existingUser.connectedPlatforms.push(githubPlatformData);
            } else {
              existingUser.connectedPlatforms[platformIndex] = githubPlatformData;
            }

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

          if (existingUser) {
            user.avatar = existingUser.avatar;
          }
          return true;
        }

        // Credentials sign in flow
        if (account?.provider === "credentials") {
          const dbUser = await User.findOne({ email: user.email });
          if (!dbUser?.emailVerified) {
            throw new Error("Please verify your email before signing in");
          }
          return true;
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        throw error;
      }
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to profile after GitHub connection
      if (url.includes('auth/callback/github')) {
        return `${baseUrl}/profile?connection=success`;
      }
      // Default redirect behavior
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (session?.user) {
        await DBConnect();
        const user = await User.findOne({ email: session.user.email })
          .select("+password +password_changes")
          .lean();

        if (user) {
          session.user = {
            ...session.user,
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar
              ? {
                  base64: user.avatar.base64,
                  contentType: user.avatar.contentType,
                  filename: user.avatar.filename,
                  createdAt: user.avatar.createdAt,
                }
              : null,
            hasPassword: user.password_changes > 0,
            password_changes: user.password_changes,
            provider: user.provider,
            connectedPlatforms: user.connectedPlatforms.map((platform) => ({
              provider: platform.provider,
              username: platform.username,
              profileUrl: platform.profileUrl,
              connectedAt: platform.connectedAt,
            })),
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

await DBConnect();

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
