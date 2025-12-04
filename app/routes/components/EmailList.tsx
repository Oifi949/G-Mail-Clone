import type { mails } from "lib/types";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  MdArchive,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDelete,
  MdMarkEmailRead,
  MdMoreVert,
  MdOutlineMarkEmailUnread,
  MdOutlineUnarchive,
  MdOutlineWatchLater,
  MdRefresh,
  MdReport,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import MailBody from "../mailbody";
import { Link } from "react-router";

export default function EmailList({
  loading,
  emails,
}: {
  loading: boolean;
  emails: (mails & {
    sender: string;
    preview?: string;
    time?: string;
  })[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [starred, setStarred] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  // if (selectedEmail) {
  //   return (
  //     <MailBody
  //       mail={selectedEmail}
  //       onClose={() => setSelectedEmail(null)}
  //     />
  //   );
  // }

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected = selected.length === emails.length;

  return (
    <div className="bg-white text-black h-full">
  {/* Top bar */}
  <div className="flex items-center justify-between px-2 sm:px-4 h-11 py-2">
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        className="p-1 rounded hover:bg-gray-200"
        onClick={() =>
          allSelected ? setSelected([]) : setSelected(emails.map((e) => e.id))
        }
      >
        {allSelected ? <MdCheckBox size={20} /> : <MdCheckBoxOutlineBlank size={20} />}
      </button>
      <button className="p-1 rounded hover:bg-gray-200">
        <MdRefresh size={20} />
      </button>
      <button className="p-1 rounded hover:bg-gray-200">
        <MdMoreVert size={20} />
      </button>
    </div>

    {/* Pagination */}
    <span className="flex gap-2 sm:gap-3 items-center">
      <span className="text-xs text-gray-500 hidden xs:block">
        1–50 of {emails.length}
      </span>
      <span className="flex gap-3 sm:gap-5">
        <button className="cursor-pointer">
          <FiChevronLeft />
        </button>
        <button className="cursor-pointer">
          <FiChevronRight />
        </button>
      </span>
    </span>
  </div>

  {/* Loading / Empty states */}
  {loading && <p className="p-4 text-gray-500">Loading…</p>}
  {!loading && emails.length === 0 && (
    <p className="p-4 text-gray-500">No received mails yet.</p>
  )}

  {/* Mail list container */}
  <div className="h-[calc(100%-44px)] overflow-auto">
    {/* Bulk actions */}
    {selected.length > 0 && (
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 bg-blue-50 text-gray-700">
        <span className="text-sm">{selected.length} selected</span>
        <button className="p-1 rounded hover:bg-gray-200">
          <MdArchive size={20} />
        </button>
        <button className="p-1 rounded hover:bg-gray-200">
          <MdDelete size={20} />
        </button>
        <button className="p-1 rounded hover:bg-gray-200">
          <MdMarkEmailRead size={20} />
        </button>
        <button className="p-1 rounded hover:bg-gray-200">
          <MdReport size={20} />
        </button>
      </div>
    )}

    {/* Mail list */}
    {emails.map((email) => {
      const isSelected = selected.includes(email.id);
      return (
        <Link key={email.id} to={`/mail/${email.id}`}>
          <div
            className={`group flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow px-2 sm:px-4 py-2 border-b border-b-gray-300 cursor-pointer transition-all ease-in-out duration-300
              ${isSelected ? "bg-blue-50" : ""}`}
          >
            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button onClick={(e) => toggleSelect(email.id, e)}>
                {isSelected ? (
                  <MdCheckBox className="text-blue-600" size={20} />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-gray-400" size={20} />
                )}
              </button>

              {/* Star toggle */}
              <MdStarBorder
                onClick={(e) => toggleStar(email.id, e)}
                className={`${
                  starred.includes(email.id) ? "hidden" : "text-gray-400 flex"
                }`}
                size={20}
              />
              <MdStar
                onClick={(e) => toggleStar(email.id, e)}
                className={`${
                  starred.includes(email.id)
                    ? "text-yellow-400 flex"
                    : "text-gray-400 hidden"
                }`}
                size={20}
              />

              {/* Sender */}
              <p className="font-semibold text-sm truncate max-w-[120px] sm:max-w-[200px]">
                {email.sender}
              </p>

              {/* Subject + preview */}
              <p className="text-sm text-gray-700 truncate whitespace-nowrap max-w-[200px] sm:max-w-[500px] md:max-w-[850px]">
                {email.subject} –{" "}
                <span className="text-gray-500">{email.preview}</span>
              </p>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <span className="text-xs text-gray-500 group-hover:hidden">
                {email.time}
              </span>
              <div className="hidden group-hover:flex transition-all duration-300 ease-in-out items-center gap-2 ml-2">
                <button className="px-1 rounded hover:bg-gray-200">
                  <MdOutlineUnarchive />
                </button>
                <button className="px-1 rounded hover:bg-gray-200">
                  <RiDeleteBin6Line />
                </button>
                <button className="px-1 rounded hover:bg-gray-200">
                  <MdOutlineMarkEmailUnread />
                </button>
                <button className="px-1 rounded hover:bg-gray-200">
                  <MdOutlineWatchLater />
                </button>
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</div>

  );
}
