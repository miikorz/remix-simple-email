import { apiEndpoints } from "./apiEndpoints";

const addTagToEmail = async (type: string, emailId: string, tagId: string, read: string) => {
    const response = await fetch(apiEndpoints.emails, {
      method: "POST",
      body: new URLSearchParams({
        type,
        emailId,
        tagId,
        read
      }),
    });

    return await response.json();
}

const deleteTagFromEmail = async (type: string, emailId: string, tagId: string, read: string) => {
    const response = await fetch(apiEndpoints.emails, {
      method: "POST",
      body: new URLSearchParams({
        type,
        emailId,
        tagId,
        read
      }),
    });

    return await response.json();
}

const toggleReadStatus = async (type: string, emailId: string, read: string) => {
    await fetch(apiEndpoints.emails, {
        method: "POST",
        body: new URLSearchParams({
        type,
        emailId,
        read
        }),
    });
}

const fetchEmails = async () => {
    const response = await fetch(apiEndpoints.emails);
    const emails = await response.json();
    console.log({emails});
    return emails;
}

const deleteEmail = async (type: string, emailId: string, read: string) => {
    const response = await fetch(apiEndpoints.emails, {
      method: "POST",
      body: new URLSearchParams({
        type,
        emailId,
        read
      }),
    });

    return await response.json();
}

const fetchTags = async () => {
    const response = await fetch(apiEndpoints.tags);
    return await response.json();
}

const createNewTag = async (type: string, name: string) => {
    const response = await fetch(apiEndpoints.tags, {
      method: "POST",
      body: new URLSearchParams({
        type,
        name
      }),
    });

    return await response.json();
}

const deleteTag = async (type: string, tagId: string) => {
    const response = await fetch(apiEndpoints.tags, {
      method: "POST",
      body: new URLSearchParams({ id: tagId, type }),
    });

    if (!response.ok) {
      return { error: "Error deleting tag, probably in use" };
    }

    return await response.json();
}

export default { 
    addTagToEmail, 
    deleteTagFromEmail, 
    toggleReadStatus, 
    fetchEmails, 
    deleteEmail, 
    fetchTags,
    createNewTag,
    deleteTag
}