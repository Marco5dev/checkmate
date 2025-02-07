import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex justify-center h-screen login-bg bg-cover bg-no-repeat bg-center w-screen">
      <SettingsClient session={session} />
    </main>
  );
}
