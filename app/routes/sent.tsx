import React, { useEffect, useState } from "react";
import supabase from "lib/supabase";
import type { mails } from "lib/types";
import EmailList from "./components/EmailList";

export function meta() {
  return [
    { title: "G-Mail | Clone | sent" },
    {
      name: "description",
      content:
        "A responsive Instagram-like page built with React Router and Tailwind CSS.",
    },
  ];
}

export default function Sent() {
  const [emails, setEmails] = useState<
    Array<mails & { recipient?: string; preview?: string; time?: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchSent() {
      setLoading(true);

      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();
        let signedInEmail = authUser.email;
        let uid: string | null = authUser.id;

        if (!uid || !signedInEmail) {
          setEmails([]);
          setLoading(false);
          return;
        }
        

        const { data, error } = await supabase
          .from("mails")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

          console.log({data});
          

        if (error) {
          console.error("Error fetching sent mails:", error);
        } else if (mounted && data) {
          const mapped = (data as mails[])
            .map((m) => ({
              ...m,
              recipient:
                (m as any).recipient_email ?? (m as any).recipient_name,
              preview: m.body?.slice(0, 120) ?? "",
              time: new Date(m.created_at).toLocaleString(),
            }));
          setEmails(mapped);
        }
      } catch (e) {
        console.error("Sent: error getting user from auth", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSent();
    return () => {
      mounted = false;
    };
  }, []);

  return <EmailList emails={emails} loading={loading} />;
}
