import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdHelpOutline,
  MdSettings,
  MdApps,
  MdNotifications,
  MdEmail,
} from "react-icons/md";
import AccountDropdown from "./AccountDropdown";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router";
import supabase from "lib/supabase";

type NavbarProps = { userId?: string };

type Mail = {
  id: number;
  subject: string;
  created_at: string;
  name: string;
  body: string;
};

export default function Navbar({ userId }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Mail[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length === 0) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("mails")
        .select("*")
        .ilike("subject", `%${searchTerm}%`);

      console.log("Search results:", data);

      if (error) {
        console.error(error);
      } else if (data) {
        setResults(data);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="flex items-center w-full justify-between px-3 sm:px-4 py-2">
      {/* Left Section */}
      <div className="flex gap-9">
        <div className="flex items-center gap-2 w-auto md:w-[200px]">
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

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs items-center sm:max-w-md md:max-w-lg lg:max-w-xl">
          {/* Search Input */}
          <div
            className="flex md:w-[550px] w-[160px] items-center bg-white rounded-full shadow-sm 
                  px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 
                  focus-within:ring-2 focus-within:ring-blue-500"
          >
            <MdSearch className="text-gray-500 mr-2 sm:mr-3" size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mail"
              className="flex-1 bg-transparent outline-none 
                 text-xs sm:text-sm md:text-base lg:text-lg"
            />
          </div>

          {/* Dropdown Results */}
          {results.length > 0 && (
            <ul
              className="absolute mt-2 w-full bg-white rounded-lg shadow-lg 
               border border-gray-200 max-h-60 overflow-y-auto z-50"
            >
              {results.map((mail) => (
                <li
                  key={mail.id}
                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer 
                   text-xs sm:text-sm md:text-base"
                >
                  <Link to={`/mail/${mail.id}`} className="flex items-center gap-3 mx-3">
                  <MdEmail size={24} />
                  <div className="block">
                    <span className="font-medium">{mail.subject}</span>
                    <p className="text-gray-500 truncate whitespace-nowrap max-w-[400px]">{mail.body}</p>
                  </div>
                 
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 relative">
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
  );
}
