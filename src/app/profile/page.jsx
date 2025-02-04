import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileEditor from "@/components/ProfileEditor";
import { DBConnect } from "@/utils/mongodb";
import User from "@/models/User";

export default async function Profile() {
  await DBConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch and serialize user data
  const userData = await User.findById(session.user.id).lean();
  
  // Serialize the MongoDB document and remove sensitive/complex fields
  const serializedUser = {
    id: userData._id.toString(),
    name: userData.name,
    email: userData.email,
    username: userData.username,
    avatar: userData.avatar ? {
      base64: userData.avatar.base64,
      contentType: userData.avatar.contentType
    } : null,
    provider: userData.provider,
    hasPassword: Boolean(userData.password && userData.password.length > 0), // Add this line
    role: userData.role,
    createdAt: userData.createdAt?.toISOString(),
    updatedAt: userData.updatedAt?.toISOString()
  };

  const enrichedSession = {
    ...session,
    user: {
      ...session.user,
      ...serializedUser
    }
  };

  return (
    <main className="login-bg bg-cover bg-no-repeat bg-center flex flex-col content-center text-center items-center pt-24 min-h-screen font-[family-name:var(--font-geist-sans)] bg-bg-img">
      <div className="flex flex-col items-start gap-4 p-10 bg-base-300 rounded-xl w-[95%] lg:w-[95%] text-center">
        <h1 className="text-3xl font-bold mb-6 w-full">Profile Settings</h1>
        <ProfileEditor session={enrichedSession} />
      </div>
    </main>
  );
}
