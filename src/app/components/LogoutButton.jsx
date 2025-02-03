"use client";

import { signOut } from "next-auth/react";
import axios from "axios";

export default function LogoutButton({ className, children }) {
  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={className || "btn btn-error"}>
      {children || "Logout"}
    </button>
  );
}
