import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NotesClient from "@/components/NotesClient";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex justify-center h-screen login-bg bg-cover bg-no-repeat bg-center">
      <div className="w-[95%] h-5/6 mt-24 flex flex-col items-center contect-center">
        <NotesClient session={session} />
      </div>
    </main>
  );
}