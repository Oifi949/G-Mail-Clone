import { Outlet, useLocation, useParams } from "react-router";
import EmailList from "./components/EmailList";
import MailBody from "./mailbody";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function AppLayout() {
  const { userId } = useParams();
  const location = useLocation();
  const folder = location.pathname.split("/").pop() || "inbox";

  const [selectedMail, setSelectedMail] = useState<any | null>(null);

  return (
    <div className="h-screen w-full text-black">
      <div className="md:h-[72px] h-[60px] bg-[#f9fdf8]">
        <Navbar userId={userId} />
      </div>
      <div className="bg-[#f9fdf8] flex h-[calc(100vh-72px)]">
        <div className="">
          <Sidebar />
        </div>
        <div className="flex-1 h-full pb-4 bg-white text-white">
          <div className="h-full rounded-2xl overflow-x-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
