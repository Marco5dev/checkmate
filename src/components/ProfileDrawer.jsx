"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faUser,
  faSignOutAlt,
  faX,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "./LogoutButton";

const ProfileDrawer = ({ isOpen, onClose, direction, session }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 bg-gray-900/75 transition-opacity duration-300 z-50 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={drawerRef}
        className={`fixed top-0 ${
          direction === "left" ? "left-0" : "right-0"
        } h-full bg-base-300 w-80 
          transition-transform duration-300 transform ${
            isOpen
              ? "translate-x-0"
              : direction === "left"
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            direction === "left" ? "right-4" : "left-4"
          } btn btn-ghost z-30 font-bold text-lg`}
        >
          <FontAwesomeIcon icon={faX} className="opacity-40" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center pt-12 pb-8 px-4 bg-base-200">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2 ring-offset-base-300 mb-4">
            {session?.user?.avatar?.base64 ? (
              <Image
                src={`data:${session.user.avatar.contentType};base64,${session.user.avatar.base64}`}
                alt="Profile"
                width={112}
                height={112}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="bg-gray-300 w-full h-full rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-600 text-4xl"
                />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">{session?.user?.name}</h3>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <ul className="menu bg-base-200 w-full rounded-xl">
            <li>
              <Link
                href="/profile"
                className="flex items-center p-3 hover:bg-base-300"
              >
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center p-3 hover:bg-base-300"
              >
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center p-3 hover:bg-base-300"
              >
                <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-8 w-full px-4">
          <LogoutButton className="btn btn-error w-full flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </LogoutButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
