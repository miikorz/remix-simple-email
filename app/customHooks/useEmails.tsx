import { useEffect, useState } from "react";
import apiClient from "~/apiClient/apiClient";
import { Email } from "~/interfaces/Email";

export const useEmails = () => {
  // TODO: move filter status to constants
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
    const updatedEmails = await apiClient.deleteEmail("delete", email.id.toString(), (email.read).toString());
    setFilter("all");
    setEmails(updatedEmails)
  }

  return { emails, filter, deleteEmail, setFilter };
};
