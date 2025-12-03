import React, { useState } from "react";
import {
  MdSearch,
  MdHelpOutline,
  MdSettings,
  MdApps,
  MdNotifications,
} from "react-icons/md";
import AccountDropdown from "./AccountDropdown";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router";

type NavbarProps = { userId?: string };

export default function Navbar({ userId }: NavbarProps) {
  return (
    <>
      {/* Navbar */}
      <div className="flex items-center w-full justify-between px-3 sm:px-4 py-2">
        {/* Left Section: Hamburger + Logo */}
        <div className="flex gap-9">
        <div className="flex items-center gap-2 w-auto md:w-[238px]">
          {/* Hamburger only on mobile */}
          <button className="h-10 w-10 rounded-full hover:bg-gray-200 grid place-items-center">
            <IoMdMenu size={24} />
          </button>
          <Link to={"/"} className="cursor-pointer">
            <img
              src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png"
              alt="Gmail Logo"
              className="h-5 md:w-25 w-auto sm:h-6 object-cover"
            />
          </Link>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex items-center flex-1 max-w-[160px] sm:max-w-md md:min-w-xl mx-2 sm:mx-6 bg-gray-100 rounded-full px-2 sm:px-3 py-1 sm:py-2">
          <MdSearch className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search mail"
            className="flex-1 bg-transparent outline-none h-6 sm:h-8 md:h-10 text-xs sm:text-sm"
          />
        </div>
        </div>

        {/* Right Section: Icons + Profile */}
        <div className="flex items-center gap-1 sm:gap-2 relative">
          {/* Icons hidden on mobile */}
          <button className="p-2 rounded-full hidden sm:block hover:bg-gray-100">
            <MdHelpOutline size={20} className="sm:size-8" />
          </button>
          <button className="p-2 rounded-full hidden sm:block hover:bg-gray-100">
            <MdSettings size={20} className="sm:size-8" />
          </button>
          <button className="p-2 rounded-full hidden sm:block hover:bg-gray-100">
            <MdApps size={20} className="sm:size-8" />
          </button>
          <button className="p-2 rounded-full hidden sm:block hover:bg-gray-100 relative">
            <MdNotifications size={20} className="sm:size-8" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1">
              3
            </span>
          </button>
          <AccountDropdown />
        </div>
      </div>
    </>
  );
}
