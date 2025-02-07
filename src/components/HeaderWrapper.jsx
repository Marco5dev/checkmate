import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserData } from "@/utils/getUserData";
import Header from "./Header";

export default async function HeaderWrapper() {
  const session = await getServerSession(authOptions);
  let userData = null;
  
  if (session) {
    userData = await getUserData(session.user.id);
  }

  return <Header initialSession={session} initialUserData={userData} />;
}
