import React, { Suspense, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LuForward, LuReply } from "react-icons/lu";
import {
  MdArchive,
  MdAttachFile,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDelete,
  MdMoreVert,
  MdRefresh,
  MdReply,
} from "react-icons/md";
import { data, Link, useParams } from "react-router-dom";
import supabase from "../../lib/supabase";
import type { mails } from "../../lib/types";
import { GrEmoji } from "react-icons/gr";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./components/popover";

export default function MailBody() {
  const { id } = useParams();
  const [email, setEmail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const normalizeReplies = (r: any): any[] => {
    if (!r) return [];
    if (Array.isArray(r)) return r;
    if (typeof r === "string") {
      try {
        const parsed = JSON.parse(r);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return Object.values(parsed);
        return [];
      } catch (e) {
        return [];
      }
    }
    if (typeof r === "object") return Object.values(r);
    return [];
  };

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    const fetchEmail = async () => {
      setLoading(true);
      try {
        if (!mounted) return;
        const { data, error } = await supabase
          .from("mails")
          .select("*")
          .eq("id", id)
          .single();

        console.log("mail data");
        console.log(data);

        if (error) {
          throw error;
        } else {
          setEmail(data);
        }
      } catch (error) {
        console.error("mailbody fetch error", error);
        alert("something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!email) return;
    const ok = confirm("Delete this message?");
    if (!ok) return;
    try {
      const { error } = await supabase
        .from("mails")
        .delete()
        .eq("id", email.id);
      if (error) {
        console.error("Delete error", error);
        alert("Failed to delete message");
      } else {
        window.dispatchEvent(new Event("mails-updated"));
        // onClose?.();
      }
    } catch (e) {
      console.error(e);
      alert("Unexpected error deleting message");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !email) return;
    try {
      const userRes = await supabase.auth.getUser();
      const userEmail =
        (userRes as any)?.data?.user?.email ?? "you@example.com";
      const quoted = `\n\nOn ${new Date(email.created_at).toLocaleString()}, ${email.sender} wrote:\n> ${email.body.replace(/\n/g, "\n> ")}`;
      const newReply = {
        id: crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        sender: userEmail,
        body: replyText + quoted,
        created_at: new Date().toISOString(),
      };
      const currentReplies = normalizeReplies(email.replies);
      const updatedReplies = [...currentReplies, newReply];
      const { error } = await supabase
        .from("mails")
        .update({ replies: updatedReplies })
        .eq("id", email.id);
      if (error) {
        console.error("Reply update error", error);
        alert("Failed to send reply");
      } else {
        setEmail({ ...email, replies: updatedReplies });
        setReplyText("");
        window.dispatchEvent(new Event("mails-updated"));
      }
    } catch (e) {
      console.error(e);
      alert("Unexpected error sending reply");
    }
  };

  const repliesToShow = normalizeReplies(email?.replies);
  const visibleReplies = showAllReplies
    ? repliesToShow
    : repliesToShow.slice(-1);
  const hiddenCount = repliesToShow.length - visibleReplies.length;

  if (loading) return <div className="p-6">Loading...</div>;
  if (!email) {
    return (
      <div className="p-6 text-black">
        {/* <button onClick={onClose}>← Back</button> */}
        <p className="animate-pulse">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="text-black mx-2 sm:mx-6 md:mx-10 overflow-x-auto">
  <Suspense>
    <div className="overflow-x-auto p-3 sm:p-6 mx-auto dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Link className="text-blue-600 text-xs sm:text-sm" to={"/sent"}>
        ← back
      </Link>

      {/* Top Action Bar */}
      <div className="flex flex-wrap justify-end gap-2 sm:gap-3 mb-4 text-gray-500">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Archive">
          <MdArchive size={18} className="sm:size-8" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Delete"
          onClick={handleDelete}
        >
          <MdDelete size={18} className="sm:size-8" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Reply"
          onClick={() => {
            const to = email.recipient ?? email.confirmation_ur ?? email.sender ?? "";
            const subject = email.subject?.startsWith("Re:") ? email.subject : `Re: ${email.subject}`;
            window.dispatchEvent(new CustomEvent("open-compose", { detail: { to, subject } }));
          }}
        >
          <MdReply size={18} className="sm:size-8" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="More">
          <MdMoreVert size={18} className="sm:size-8" />
        </button>
      </div>

      {/* Subject */}
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 break-words">
          {email?.subject}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">{new Date(email?.created_at).toLocaleString()}</p>
      </div>

      {/* Sender Info */}
      <div className="flex items-start gap-3 sm:gap-4 mb-6 flex-wrap">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm sm:text-lg">
          {(email?.sender && email?.sender.charAt(0).toUpperCase()) || "U"}
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
            {email.sender ?? "You"}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            To: {email?.recipient ?? email?.confirmation_ur ?? "you"}
          </p>
        </div>
      </div>

      {/* Message Body */}
      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed mb-6 border-b pb-6 break-words">
        {email?.body}
      </div>

      {/* Replies */}
      {repliesToShow.length > 0 && (
        <div className="space-y-4 sm:space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {!showAllReplies && hiddenCount > 0 && (
            <button
              onClick={() => setShowAllReplies(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Show {hiddenCount} more {hiddenCount === 1 ? "reply" : "replies"}
            </button>
          )}
          {visibleReplies.map((reply: any) => (
            <div key={reply.id} className="pl-3 sm:pl-6 border-l-2 border-gray-200 dark:border-gray-700">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">{reply.sender}</span> · {new Date(reply.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
                {reply.body}
              </div>
              {reply.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {reply.attachments.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-600 underline break-all"
                    >
                      Attachment {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Editor */}
      <div id="reply-editor" className="mt-6 sm:mt-8 border-t pt-4">
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-gray-100"
          rows={4}
          placeholder="Write your reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <MdAttachFile size={18} className="sm:size-20" />
            </button>
            <span className="text-xs sm:text-sm">Attachment support coming soon</span>
          </div>
          <button
            onClick={handleReply}
            className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 text-xs sm:text-sm"
          >
            Send
          </button>
        </div>
      </div>

      {/* Floating Reply Toolbar */}
      <div className="mb-2 mt-2 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-3 z-50">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              const replyBox = document.getElementById("reply-editor");
              replyBox?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="text-black border px-4 sm:px-8 py-2 rounded-full hover:bg-gray-100 cursor-pointer flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
          >
            <LuReply size={20} className="sm:size-23" />
            Reply
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="text-black border px-4 sm:px-8 py-2 rounded-full hover:bg-gray-100 cursor-pointer flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
                variant={"outline"}
              >
                <LuForward size={20} className="sm:size-23" />
                Forward
              </Button>
            </PopoverTrigger>
            <PopoverContent className="text-white w-[120px] sm:w-[140px] px-3 sm:px-5 py-2 bg-black/70 text-xs font-normal">
              Forward is under construction coming soon
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="px-2 sm:px-4">
                <GrEmoji size={20} className="sm:size-23" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="text-white w-[120px] sm:w-[140px] px-3 sm:px-5 py-2 bg-black/70 text-xs font-normal">
              Emoji attachment coming soon
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  </Suspense>
</div>

  );
}
