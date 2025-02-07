"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faFolderOpen,
  faEllipsisVertical,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import LoadingHeader from "./loadings/LoadingHeader"; // Create this component for loading state
import { usePathname } from "next/navigation";
import LoadingAvatar from "./loadings/LoadingAvatar";
import LoadingFolderItem from "@/components/loadings/LoadingFolderItem";
import ProfileDrawer from "./ProfileDrawer";

export default function Header({ initialSession, initialUserData }) {
  const [session] = useState(initialSession);
  const [userData] = useState(initialUserData);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeftProfileOpen, setIsLeftProfileOpen] = useState(false);
  const [isRightProfileOpen, setIsRightProfileOpen] = useState(false);
  const pathname = usePathname();
  const isTasksRoute = pathname === "/tasks";
  const isNotesRoute = pathname === "/notes";
  const [drawerFolders, setDrawerFolders] = useState([]);
  const [drawerSelectedFolder, setDrawerSelectedFolder] = useState(null);
  const [drawerFolderToEdit, setDrawerFolderToEdit] = useState(null);
  const [drawerFolderToDelete, setDrawerFolderToDelete] = useState(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isFoldersLoading, setIsFoldersLoading] = useState(true);
  const [notesDrawerFolders, setNotesDrawerFolders] = useState([]);
  const [notesSelectedFolder, setNotesSelectedFolder] = useState(null);

  useEffect(() => {
    const handleFoldersUpdate = (e) => {
      if (e.detail) {
        setDrawerFolders(e.detail.folders);
        setDrawerSelectedFolder(e.detail.selectedFolder);
        setIsFoldersLoading(false);
      }
    };

    const handleNotesFoldersUpdate = (e) => {
      if (e.detail) {
        setNotesDrawerFolders(e.detail.folders);
        setNotesSelectedFolder(e.detail.selectedFolder);
        setIsFoldersLoading(false);
      }
    };

    window.addEventListener("updateFoldersList", handleFoldersUpdate);
    window.addEventListener("updateNotesFoldersList", handleNotesFoldersUpdate);
    return () => {
      window.removeEventListener("updateFoldersList", handleFoldersUpdate);
      window.removeEventListener(
        "updateNotesFoldersList",
        handleNotesFoldersUpdate
      );
    };
  }, []);

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
      {userData.avatar?.base64 ? (
        <Image
          src={`data:${userData.avatar.contentType};base64,${userData.avatar.base64}`}
          alt={userData.name || "Profile"}
          width={40}
          height={40}
          className={`rounded-full object-cover ${
            isAvatarLoading ? "hidden" : ""
          }`}
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
          <Link href="/home" onClick={toggleDrawer}>
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

            {isFoldersLoading
              ? [...Array(4)].map((_, i) => <LoadingFolderItem key={i} />)
              : drawerFolders.map((folder) => (
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
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="w-4 h-4"
                      />
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
                ))}
          </div>
        </div>
      )}

      {isNotesRoute && (
        <div className="p-4 m-2 rounded-lg px-4 bg-base-200">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Notes Folders</h2>
            <button
              onClick={() => {
                // Use different event name for notes folders
                window.dispatchEvent(
                  new CustomEvent("openNotesNewFolderModal")
                );
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
                  new CustomEvent("selectNotesFolder", {
                    detail: { folder: null },
                  })
                );
                toggleDrawer();
              }}
              className={`flex w-full items-center gap-2 p-2 rounded hover:bg-base-300 ${
                !notesSelectedFolder ? "bg-base-300 text-primary font-bold" : ""
              }`}
            >
              <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
              <span>All Notes</span>
            </button>

            {isFoldersLoading
              ? [...Array(4)].map((_, i) => <LoadingFolderItem key={i} />)
              : notesDrawerFolders.map((folder) => (
                  <div key={folder._id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("selectNotesFolder", {
                            detail: { folder },
                          })
                        );
                        toggleDrawer();
                      }}
                      className={`flex flex-1 items-center gap-2 p-2 rounded hover:bg-base-300 ${
                        notesSelectedFolder?._id === folder._id
                          ? "bg-base-300 text-primary font-bold"
                          : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="w-4 h-4"
                      />
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
                                new CustomEvent("editNotesFolder", {
                                  detail: { folder },
                                })
                              );
                              toggleDrawer();
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="mr-2"
                            />
                            Rename
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent("deleteNotesFolder", {
                                  detail: { folder },
                                })
                              );
                              toggleDrawer();
                            }}
                            className="text-error"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="mr-2"
                            />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex justify-center my-4 fixed top-0 w-screen z-50">
      <div className="navbar bg-base-300 w-[95%] lg:w-[95%] rounded-xl justify-between">
        {/* profile drawer */}
        <div className="lg:hidden">
          <button
            onClick={toggleDrawer}
            className="btn text-xl btn-square btn-ghost p-3 lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <div>
          <Link href="/" className="btn btn-ghost text-xl">
            {Title}
          </Link>
        </div>

        {/* Center section - Updated with active states */}
        <div className="hidden lg:flex flex-none absolute left-1/2 transform -translate-x-1/2">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link 
                href="/home" 
                className={pathname === "/home" ? "active bg-primary text-primary-content" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/tasks" 
                className={pathname === "/tasks" ? "active bg-primary text-primary-content" : ""}
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link 
                href="/notes" 
                className={pathname === "/notes" ? "active bg-primary text-primary-content" : ""}
              >
                Notes
              </Link>
            </li>
          </ul>
        </div>

        {/* Right section with profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRightProfileOpen(true)}
            className="btn btn-ghost btn-circle avatar"
          >
            {renderAvatar()}
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
          className={`fixed top-0 left-0 h-full bg-base-300 w-80 transition-transform duration-300 transform ${
            isDrawerOpen ? "-translate-x-0" : "-translate-x-full"
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
        direction="right"
        userData={userData}
      />

      {/* Right Profile Drawer */}
      <ProfileDrawer
        isOpen={isRightProfileOpen}
        onClose={() => setIsRightProfileOpen(false)}
        direction="right"
        userData={userData}
      />
    </div>
  );
}
