"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function HomeClient({ session, greeting }) {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! Welcome to CheackMate!');
      // Clean up the URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <main className="login-bg bg-cover bg-no-repeat bg-center flex flex-col content-center text-center items-center pt-24 min-h-screen font-[family-name:var(--font-geist-sans)] bg-bg-img">
      <div className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-[95%] lg:w-[95%] justify-center">
        <div className="flex justify-start h-full">
          <h1 className="text-2xl flex flex-col justify-center items-center font-merriweather">
            {greeting},{" "}
            <span className="text-5xl text-primary font-edu font-bold">
              {session.user.name}!
            </span>
          </h1>
        </div>
      </div>
    </main>
  );
}
