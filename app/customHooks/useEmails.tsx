import { useEffect, useState } from "react";
import apiClient from "~/apiClient/apiClient";
import { Email } from "~/interfaces/Email";

export const useEmails = () => {
  const [ filter, setFilter ] = useState<"all" | "read" | "unread">("all");
  const [ emails, setEmails ] = useState<Email[]>([]);

  useEffect(() => {
    fetchEmails(filter);
  }, [filter]);

  const fetchEmails = async (filterValue: "all" | "read" | "unread") => {
    const emails = await apiClient.fetchEmails();
    const filteredEmails: Email[] = emails?.filter((email: Email) => {
    if (filterValue === "all") return true;

    return filterValue === "read" ? email.read : !email.read;
  });

    setEmails(filteredEmails);
  }
  
  const deleteEmail = async (email: Email) => {
    await apiClient.deleteEmail("delete", email.id.toString(), (email.read).toString());
    if (filter === "all") {
      fetchEmails("all");
    } else {
      setFilter("all");
    }
  }

  return { emails, filter, deleteEmail, setFilter };
};
