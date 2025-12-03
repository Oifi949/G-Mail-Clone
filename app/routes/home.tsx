import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import EmailList from "./components/EmailList";
import MailBody from "./mailbody";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const { userId } = useParams();
  const location = useLocation();
  const folder = location.pathname.split("/").pop() || "inbox";

  const [selectedMail, setSelectedMail] = useState<any | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar userId={userId} />
      <div className="flex flex-1 flex-col">
        <Navbar userId={userId} />
        <div className="flex flex-1">
          <div className="flex-1">
            <EmailList
              userId={userId}
              folder={folder}
              onOpenMail={(m:any) => setSelectedMail(m)}
            />
          </div>
          <MailBody mail={selectedMail} />
        </div>
      </div> */}
    </div>
  );
}
