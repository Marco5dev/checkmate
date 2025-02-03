"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import ProfileDrawer from "./ProfileDrawer";
import LoadingHeader from './LoadingHeader'; // Create this component for loading state

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeftProfileOpen, setIsLeftProfileOpen] = useState(false);
  const [isRightProfileOpen, setIsRightProfileOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingHeader />; // Show loading skeleton
  }

  if (!session) {
    return null; // Don't render header if no session
  }

  // Debug session data
  console.log('Session user:', session.user);
  console.log('Avatar data:', session.user.avatar);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const Title = "CheckMate";

  const renderAvatar = () => (
    <div className="w-10 rounded-full overflow-hidden">
      {session.user.avatar?.base64 ? (
        <Image
          src={`data:${session.user.avatar.contentType};base64,${session.user.avatar.base64}`}
          alt={session.user.name || "Profile"}
          width={40}
          height={40}
          className="rounded-full object-cover"
          priority
        />
      ) : (
        <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-gray-600" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex justify-center my-4 fixed top-0 w-screen z-50">
      <div className="navbar bg-base-300 w-[95%] lg:w-[95%] rounded-xl justify-between shadow-2xl">
        <div className="lg:hidden">
          <button
            onClick={() => setIsLeftProfileOpen(true)}
            className="btn btn-ghost btn-circle avatar"
          >
            {renderAvatar()}
          </button>
        </div>

        <div>
          <Link href="/" className="btn btn-ghost text-xl">
            {Title}
          </Link>
        </div>

        {/* Center section */}
        <div className="hidden lg:flex flex-none absolute left-1/2 transform -translate-x-1/2">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/tasks">Tasks</Link>
            </li>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
          </ul>
        </div>

        {/* Right section with profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRightProfileOpen(true)}
            className="btn btn-ghost btn-circle avatar hidden lg:flex"
          >
            {renderAvatar()}
          </button>

          <button
            onClick={toggleDrawer}
            className="btn text-xl btn-square btn-ghost p-3 lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          // Close drawer only if clicking the overlay (not the drawer content)
          if (e.target === e.currentTarget) {
            setIsDrawerOpen(false);
          }
        }}
      >
        <div
          className={`fixed top-0 right-0 h-full bg-base-300 w-80 transition-transform duration-300 transform ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } lg:w-1/2`}
        >
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-4 btn btn-ghost z-30 font-bold text-lg"
          >
            <FontAwesomeIcon icon={faX} className="opacity-40" />
          </button>
          <ul className="menu rounded-box w-56 mt-4">
            <li>
              <h2 className="menu-title">{Title}</h2>
              <ul>
              <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/tasks">Tasks</Link>
            </li>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Left Profile Drawer */}
      <ProfileDrawer
        isOpen={isLeftProfileOpen}
        onClose={() => setIsLeftProfileOpen(false)}
        direction="left"
        session={session}
      />

      {/* Right Profile Drawer */}
      <ProfileDrawer
        isOpen={isRightProfileOpen}
        onClose={() => setIsRightProfileOpen(false)}
        direction="right"
        session={session}
      />
    </div>
  );
};

export default Header;
