"use client";

import { useState, useEffect, useRef } from "react";
import { MdPhotoCamera } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { PiSignOutBold } from "react-icons/pi";
import { BiCloud } from "react-icons/bi";
import supabase from '../../../lib/supabase';
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function AccountDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
    const [userEmail, setUserEmail] = useState('');
    const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user?.email ?? "");
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
          if (!profileError && profileData) {
            setUsername((profileData as any).username ?? ((user as any)?.user_metadata?.username ?? ""));
          } else {
            setUsername((user as any)?.user_metadata?.username ?? "");
          }
        } catch (e) {
          setUsername((user as any)?.user_metadata?.username ?? "");
        }
      }
    };
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
    } finally {
      navigate("/");
    }
  };



  const accounts = [
    {
      name: "Qwolabi",
      email: "user1@gmail.com",
      avatar:
        "https://www.bing.com/th/id/OIP.302zgzUHVpOuGmsmRZudiAHaHk?w=194&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    },
  ];
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile avatar */}
      <img
        src={accounts[0].avatar}
        alt="Profile"
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      <div
        className={`absolute right-0 top-12 px-5 min-h-[400px] bg-blue-100 rounded-lg shadow-lg z-50 transform transition-all duration-200 ease-out
          ${showDropdown ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
      >
        <div className="text-sm font-bold relative py-3 text-center text-gray-800">
          <p className="text-center">
            <span className="">{userEmail}</span>
            <span className="absolute text-xl right-0 cursor-pointer"
            onClick={() => setShowDropdown(false)}>
              <IoClose />
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center text-center px-4 mb-3">
          <div className="relative inline-block">
            {/* Profile Image */}
            <img
              src={accounts[0].avatar}
              alt="Profile"
              className="size-26 rounded-full border"
            />

            {/* Camera Button Overlay */}
            <button
              className="absolute bottom-2 right-0 bg-gray-200 p-1 rounded-full shadow hover:bg-gray-300"
              onClick={() => alert("Change profile picture")}
            >
              <MdPhotoCamera className="text-gray-700" size={18} />
            </button>
          </div>
          <div>
            <p className="text-xl font-bold pt-2.5 font-stretch-semi-expanded text-gray-800">
              Hi {username || accounts[0].name}!
            </p>
            <button className="text-xs text-blue-600 border py-3.5 px-10 rounded-full mt-3 hover:bg-blue-50 bg-gray-100 transition-all duration-350 ease-in-out font-medium cursor-pointer">
              Manage your Google Account
            </button>
          </div>
        </div>
        <div className="flex pb-3 justify-center gap-0.5 font-semibold">
          <div className="md:min-w-[230px] w-[180px] flex items-center gap-2 py-4 px-3 bg-gray-100 rounded-l-full hover:shadow-xl shadow cursor-pointer text-sm text-gray-700">
            <span className="bg-blue-200 p-2 rounded-full">
              <FiPlus />
            </span>
            <span className="text-xs md:test-sm">
            Add another account
            </span>
          </div>
          <div onClick={handleSignOut} className="px-4 py-4 min-w-[130px] flex items-center gap-3 shadow rounded-r-full bg-gray-100 cursor-pointer hover:shadow-xl text-sm text-gray-700">
            <span className="">
              <PiSignOutBold size={27} />
            </span>
            <span className="text-xs md:text-sm">
            Sign out
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-100 hover:shadow-xl px-4 shadow rounded-full cursor-pointer flex font-bold items-center gap-2.5 text-gray-700 text-sm py-4">
          <span className="">
            <BiCloud size={27} />
          </span>
          <span>0% of 15 GB Used</span>
        </div>

        {/* Footer */}
        <div className="px-4 pt-3.5 pb-6 text-xs text-gray-500 text-center">
          Privacy Policy • Terms of Service
        </div>
      </div>
    </div>
  );
}
