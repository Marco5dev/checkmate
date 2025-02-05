"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faFolderOpen,
  faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import ProfileDrawer from "./ProfileDrawer";
import LoadingHeader from "./LoadingHeader"; // Create this component for loading state
import { usePathname } from "next/navigation";
import LoadingAvatar from "./LoadingAvatar";
import LoadingFolderItem from "@/components/LoadingFolderItem";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeftProfileOpen, setIsLeftProfileOpen] = useState(false);
  const [isRightProfileOpen, setIsRightProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isTasksRoute = pathname === "/tasks";
  const [drawerFolders, setDrawerFolders] = useState([]);
  const [drawerSelectedFolder, setDrawerSelectedFolder] = useState(null);
  const [drawerFolderToEdit, setDrawerFolderToEdit] = useState(null);
  const [drawerFolderToDelete, setDrawerFolderToDelete] = useState(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isFoldersLoading, setIsFoldersLoading] = useState(true);

  useEffect(() => {
    const handleFoldersUpdate = (e) => {
      if (e.detail) {
        setDrawerFolders(e.detail.folders);
        setDrawerSelectedFolder(e.detail.selectedFolder);
        setIsFoldersLoading(false);
      }
    };

    window.addEventListener("updateFoldersList", handleFoldersUpdate);
    return () => {
      window.removeEventListener("updateFoldersList", handleFoldersUpdate);
    };
  }, []);

  if (status === "loading") {
    return <LoadingHeader />; // Show loading skeleton
  }

  if (!session) {
    return null; // Don't render header if no session
  }

  const toggleDrawer = () => {
    const newState = !isDrawerOpen;
    setIsDrawerOpen(newState);
    window.dispatchEvent(
      new CustomEvent("toggleMobileDrawer", {
        detail: { open: newState },
      })
    );
  };

  const Title = "CheckMate";

  const renderAvatar = () => (
    <div className="w-10 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2 ring-offset-base-300">
      {isAvatarLoading && <LoadingAvatar />}
      {session.user.avatar?.base64 ? (
        <Image
          src={`data:${session.user.avatar.contentType};base64,${session.user.avatar.base64}`}
          alt={session.user.name || "Profile"}
          width={40}
          height={40}
          className={`rounded-full object-cover ${isAvatarLoading ? 'hidden' : ''}`}
          priority
          onLoadingComplete={() => setIsAvatarLoading(false)}
        />
      ) : (
        <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-gray-600" />
        </div>
      )}
    </div>
  );

  const renderDrawerContent = () => (
    <div className="flex flex-col h-full pt-16">
      <ul className="menu menu-lg w-full">
        <li>
          <Link href="/" onClick={toggleDrawer}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/tasks" onClick={toggleDrawer}>
            Tasks
          </Link>
        </li>
        <li>
          <Link href="/notes" onClick={toggleDrawer}>
            Notes
          </Link>
        </li>
      </ul>
      <div className="divider"></div>

      {isTasksRoute && (
        <div className="p-4 m-2 rounded-lg px-4 bg-base-200">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Folders</h2>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("openNewFolderModal"));
                toggleDrawer();
              }}
              className="btn btn-primary btn-sm w-full mb-4"
            >
              New Folder
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("selectFolder", {
                    detail: { folder: null },
                  })
                );
                toggleDrawer();
              }}
              className={`flex w-full items-center gap-2 p-2 rounded hover:bg-base-300 ${
                !drawerSelectedFolder
                  ? "bg-base-300 text-primary font-bold"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
              <span>All Tasks</span>
            </button>

            {isFoldersLoading ? (
              [...Array(4)].map((_, i) => (
                <LoadingFolderItem key={i} />
              ))
            ) : (
              drawerFolders.map((folder) => (
                <div key={folder._id} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("selectFolder", {
                          detail: { folder },
                        })
                      );
                      toggleDrawer();
                    }}
                    className={`flex flex-1 items-center gap-2 p-2 rounded hover:bg-base-300 ${
                      drawerSelectedFolder?._id === folder._id
                        ? "bg-base-300 text-primary font-bold"
                        : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </button>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </label>
                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                      <li>
                        <button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("editFolder", {
                                detail: { folder },
                              })
                            );
                            toggleDrawer();
                          }}
                        >
                          Rename
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("deleteFolder", {
                                detail: { folder },
                              })
                            );
                            toggleDrawer();
                          }}
                          className="text-error"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
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
          <ul className="menu menu-horizontal px-1 gap-2">
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
        onClick={toggleDrawer}
      >
        <div
          className={`fixed top-0 right-0 h-full bg-base-300 w-80 transition-transform duration-300 transform ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-4 btn btn-ghost z-30 font-bold text-lg"
          >
            <FontAwesomeIcon icon={faX} className="opacity-40" />
          </button>
          {renderDrawerContent()}
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
