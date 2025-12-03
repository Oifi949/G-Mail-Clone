import { useState } from "react";
import {
  MdInbox,
  MdOutlineWatchLater,
  MdReport,
  MdStar,
  MdDrafts,
  MdSend,
} from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { FaRegFile } from "react-icons/fa";
import { IoMdStarOutline } from "react-icons/io";
import { IoChevronDown, IoChevronUpOutline, IoClose, IoMenu } from "react-icons/io5";
import { BiSend } from "react-icons/bi";
import Compose from "./compose";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [showCompose, setShowCompose] = useState(false);
  const [showMore, setShowMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const items = [
    { name: "Inbox", icon: <MdInbox />, path: "/" },
    { name: "Starred", icon: <IoMdStarOutline />, path: "/#starred" },
    { name: "Snoozed", icon: <MdOutlineWatchLater />, path: "/#snoozed" },
    { name: "Sent", icon: <BiSend />, path: "/sent" },
    { name: "Drafts", icon: <FaRegFile />, path: "/#drafts" },
    { name: "Spam", icon: <MdReport />, path: "/#spam" },
    { name: "Important", icon: <MdStar />, path: "/#important" },
    { name: "Chats", icon: <MdDrafts />, path: "/#chat" },
    { name: "Scheduled", icon: <MdSend />, path: "/#scheduled" },
  ];

  const visibleItems = showMore ? items : items.slice(0, 5);

  return (
<div className="w-full sm:w-64 py-4 flex flex-col h-full">
  {/* Compose */}
  <button
    className="flex items-center gap-2 bg-[#C2E7FF] text-black font-semibold w-full sm:w-[130px] justify-center py-3 rounded-xl shadow hover:shadow-lg transition mb-4 px-4"
    onClick={() => setShowCompose(true)}
  >
    <GoPencil className="text-xl" />
    <span className="hidden sm:inline">Compose</span>
  </button>

  {/* Navigation */}
  <nav>
    <ul className="text-sm text-gray-700 sm:pr-10">
      {visibleItems.map(({ name, icon, path }) => (
        <li key={name}>
          {path ? (
            <Link
              to={path}
              className={`flex items-center gap-4 py-2 px-4 sm:pl-6 sm:pr-4 rounded-r-full transition-colors ${
                location.pathname === path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="hidden sm:inline">{name}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-4 py-2 px-4 text-gray-600">
              <span className="text-lg">{icon}</span>
              <span className="hidden sm:inline">{name}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  </nav>

  {/* Show more/less */}
  <button
    onClick={() => setShowMore(!showMore)}
    className="flex items-center gap-2 py-2 px-4 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-r-full transition text-sm font-medium mt-2"
  >
    <span className="text-lg">
      {showMore ? <IoChevronUpOutline /> : <IoChevronDown />}
    </span>
    <span className="hidden sm:inline">
      {showMore ? "Show less" : "Show more"}
    </span>
  </button>

  {showCompose && (
    <Compose showCompose={showCompose} setShowCompose={setShowCompose} />
  )}
</div>

  );
}
