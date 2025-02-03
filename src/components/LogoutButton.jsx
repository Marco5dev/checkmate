"use client";

import { signOut } from "next-auth/react";
import axios from "axios";

const LogoutButton = ({ className, children }) => {
  const handleLogout = async () => {
    try {
      // Call the logout API route
      await axios.get("/api/auth/logout");

      // Then use NextAuth signOut
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={`btn btn-error ${className}`}>
      {children || "Logout"}
    </button>
  );
};

export default LogoutButton;
