import supabase from "lib/supabase";
import type { mails } from "lib/types";
import { useEffect, useState } from "react";
import EmailList from "./components/EmailList";
import { useNavigate } from "react-router";

const placeholder = [
  {
    id: "placeholder-1",
    sender: "",
    subject: "Loading…",
    preview: "",
    time: "",
  },
];

type EmailListProps = { userId?: string };

export default function Inbox({
  userId,
  onOpenMail,
}: EmailListProps & { onOpenMail?: (mail: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<
    Array<mails & { sender?: string; preview?: string; time?: string }>
  >(placeholder as any);
  const router = useNavigate()

  useEffect(() => {
    let mounted = true;

    async function fetchMails() {
      setLoading(true);
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if(authError){
          router("/auth")
        }

        const { data, error } = await supabase
          .from("mails")
          .select("*")
          .eq("recipient", authUser.email)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching mails:", error);
        } else if (mounted && data) {
          const mapped = (data as mails[])
            // ✅ Only inbox mails: exclude those sent by current user
            .filter((m) => m.sender_email !== authUser.email)
            .map((m) => ({
              ...m,
              sender:
                (m as any).sender_email ??
                (m as any).sender_name ??
                (m.user_id === authUser.id ? authUser.email : m.user_id),
              preview: m.body?.slice(0, 120) ?? "",
              time: new Date(m.created_at).toLocaleString(),
            }));
          setEmails(mapped);
        } else {
          setEmails([] as any);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMails();

    const onUpdate = () => fetchMails();
    window.addEventListener("mails-updated", onUpdate as any);

    return () => {
      mounted = false;
      window.removeEventListener("mails-updated", onUpdate as any);
    };
  }, [userId]);

  return <EmailList emails={emails} loading={loading} />;
}
