import { useState } from "react";
import apiClient from "~/apiClient/apiClient";
import { Email } from "~/interfaces/Email";

export const useEmail = (emailObject: Email) => {
  const [ email, setEmail ] = useState<Email>(emailObject);
  const [ isRead, setIsRead ] = useState(emailObject.read);

  const addTag = async (tagId: string) => {
    const updatedEmail = await apiClient.addTagToEmail("add tag", email.id.toString(), tagId, (email.read).toString());
    
    setEmail(updatedEmail)
  }

  const deleteTag = async (tagId: string) => {
    const updatedEmail = await apiClient.deleteTagFromEmail("delete tag", email.id.toString(), tagId, (email.read).toString());
    
    setEmail(updatedEmail)
  }
  
  const toggleReadStatus = async () => {
    await apiClient.toggleReadStatus("update read", email.id.toString(), (!isRead).toString());

    setIsRead(!isRead);
  }

  return { addTag, deleteTag, email, isRead, toggleReadStatus };
};