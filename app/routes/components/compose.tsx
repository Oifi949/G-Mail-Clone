import { useState, useRef, useEffect } from "react";
import supabase from "../../../lib/supabase";
import {
  MdClose,
  MdAttachFile,
  MdInsertEmoticon,
  MdFormatColorText,
  MdMoreVert,
} from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import type { ChangeEvent } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function ComposeWindow({
  showCompose,
  setShowCompose,
}: {
  showCompose: boolean;
  setShowCompose: (val: boolean) => void;
}) {
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [receipients, setReceipients] = useState<string[]>([]);
  const [valideatedEmail, setValideatedEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setAttachment(e.target.files[0]);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const validateEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!regex.test(email)) {
      setError("Invalid email address");
    } else {
      setError("");
    }
    return regex.test(email);
  };

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const receivers = receipients;

    const { data: profiles } = await supabase
      .from("user_profile")
      .select("email, auth_user")
      .in("email", receivers);

    const recipients = profiles?.map((p: any) => p.email).filter(Boolean) ?? [];

    if (!(recipients.length > 0)) {
      alert("Recipients not found!");
      return;
    }

    const processed: string[] = [];

    const payloads = recipients.map((recipient: string) => {
      if (processed.includes(recipient)) return;
      processed.push(recipient);
      return {
        user_id: user.id,
        email_type: "sent",
        subject: subject || "(no subject)",
        body: message,
        recipient,
        provider_response: attachment ? attachment.name : "",
        template_id: null,
      };
    });

    console.log("payloads");
    console.log(payloads.filter(Boolean) ?? []);

    const { error } = await supabase
      .from("mails")
      .insert(payloads.filter(Boolean) ?? []);
    if (!error) {
      window.dispatchEvent(new Event("mails-updated"));
      setSubject("");
      setTo("");
      setMessage("");
      setAttachment(null);
      setShowCompose(false);
    }
  };

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
<div className="fixed bottom-0 right-0 z-50 w-full sm:w-[90%] md:w-[650px]">
  <div
    className={`bg-white shadow-xl rounded-t-lg border border-gray-300 ${
      isMinimized
        ? "w-[95%] h-[70%] sm:w-[86%] sm:h-[90%] fixed bottom-12 right-4"
        : "min-h-[400px] sm:min-h-[500px] md:min-h-[700px] w-full sm:w-[90%] md:w-[650px]"
    }`}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-800 text-sm sm:text-base">New Message</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
        >
          {isMinimized ? "▢" : "—"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCompose(false);
          }}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <MdClose size={18} className="sm:size-20" />
        </button>
      </div>
    </div>

    {/* Body */}
    {!isMinimized ? (
      <div className="p-3 sm:p-4 space-y-3">
        {/* To */}
        <div className="flex border-b border-b-gray-200 gap-2 items-center flex-wrap">
          <span className="text-xs sm:text-sm">To</span>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full">
            {receipients.map((receipient, idx) => (
              <div
                key={idx}
                className="border px-2 py-1 flex items-center rounded-full gap-2 text-xs sm:text-sm"
              >
                <span className="bg-blue-300 rounded-full w-6 h-6 flex justify-center items-center text-blue-700">
                  <FaUserAlt size={14} className="sm:size-18" />
                </span>
                {receipient}
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setReceipients((prev) => prev.filter((r) => r !== receipient))
                  }
                >
                  <IoClose />
                </span>
              </div>
            ))}
            <div className="relative flex-1 min-w-[120px]">
              <input
                type="text"
                name="to"
                id="to-input-el"
                onChange={(e) => {
                  const isValid = validateEmail(e.target.value);
                  if (isValid) {
                    setValideatedEmail(e.target.value);
                  } else {
                    setValideatedEmail("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === "enter" || e.key.toLowerCase() === "return") {
                    const inputEl = document.getElementById("to-input-el") as HTMLInputElement;
                    if (inputEl) {
                      const email = inputEl.value;
                      const isValid = validateEmail(email);
                      if (isValid) {
                        setReceipients((prev) => [...prev, email]);
                        setValideatedEmail("");
                        inputEl.value = "";
                      } else {
                        alert("invalid email");
                      }
                    }
                  }
                }}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus-visible:outline-none"
              />
              {valideatedEmail && (
                <div
                  className="absolute top-[120%] border border-gray-100 w-[90vw] sm:w-[450px] rounded-md py-2 bg-white shadow-2xl cursor-pointer"
                  onClick={() => {
                    setReceipients((prev) => [...prev, valideatedEmail]);
                    setValideatedEmail("");
                    const inputEl = document.getElementById("to-input-el") as HTMLInputElement;
                    if (inputEl) {
                      inputEl.value = "";
                    }
                  }}
                >
                  <div className="flex gap-2 sm:gap-3 items-center bg-gray-200 p-2 text-xs sm:text-sm">
                    <span className="bg-blue-300 rounded-full w-8 h-8 flex justify-center items-center text-blue-700">
                      <FaUserAlt size={16} className="sm:size-24" />
                    </span>
                    {valideatedEmail}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="flex border-b border-b-gray-200 gap-2 items-center">
          <span className="text-xs sm:text-sm">Subject</span>
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          />
        </div>

        {/* Message */}
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-[200px] sm:h-[300px] md:h-[500px] px-2 sm:px-3 py-2 text-xs sm:text-sm resize-none border-none"
          placeholder="Write your message..."
        ></textarea>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-24 right-4 sm:right-8 z-50" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded font-medium hover:bg-blue-700 text-xs sm:text-sm"
          >
            Send
          </button>
          <div className="flex space-x-2 sm:space-x-3 text-gray-500">
            <label title="Attach file" className="cursor-pointer">
              <MdAttachFile size={18} className="sm:size-20" />
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            <button type="button" title="Insert emoji" ref={dropdownRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <MdInsertEmoticon size={18} className="sm:size-20" />
            </button>
            <button type="button" title="Formatting options">
              <MdFormatColorText size={18} className="sm:size-20" />
            </button>
            <button type="button" title="More options">
              <MdMoreVert size={18} className="sm:size-20" />
            </button>
          </div>
        </div>

        {/* Attachment Preview */}
        {attachment && (
          <div className="text-xs sm:text-sm text-gray-600 mt-2">
            Attached: <strong>{attachment.name}</strong>
          </div>
        )}
      </div>
    ) : (
      <div className="p-3 sm:p-4 text-gray-600 text-xs sm:text-sm">Message minimized</div>
    )}
  </div>
</div>

  );
}
