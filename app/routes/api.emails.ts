/* eslint-disable no-case-declarations */
import { prisma } from "~/db.server";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";

// Load all emails
export const loader: LoaderFunction = async () => {
  const emails = await prisma.email.findMany({
    include: { tags: true },
  });
  // if emails is empty create some dummy data
  if (emails.length === 0) {
    await prisma.email.createMany({
      data: [
        { subject: 'Test Email', body: 'Hello, how are you?', read: false },
        { subject: 'Another Test Email', body: 'Asking again how are you', read: true },
        { subject: 'Yet Another Test Email', body: 'I may be anoying but... how are you?', read: false },
      ],
    })
    const newEmails = await prisma.email.findMany({
      include: { tags: true },
    });
    
    return json(newEmails);
  }

  return json(emails);
};

// Action to handle creating, updating, or deleting emails, best scenario probably would be
// to split these into separate functions/endpoints
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const type = data.get("type");
  const read = data.get("read");

 if (type === "update read") {
    const id = parseInt(data.get("emailId") as string);
    const isEmailRead = read === "true";
    await prisma.email.update({ where: { id }, data: { read: isEmailRead } });

    return json({ success: true });
  } else if (type === "add tag") {
    await prisma.tagsOnEmails.create({ data: { emailId: parseInt(data.get("emailId") as string), tagId: parseInt(data.get("tagId") as string) } });
    const email = await prisma.email.findUnique({
      where: { id: parseInt(data.get("emailId") as string) },
      include: { tags: true },
    });
    
    return json(email);
  } else if (type === "delete tag") {
    await prisma.tagsOnEmails.delete({ where: { emailId_tagId: {
      emailId: parseInt(data.get("emailId") as string),
      tagId: parseInt(data.get("tagId") as string),
    } } });

    const email = await prisma.email.findUnique({
      where: { id: parseInt(data.get("emailId") as string) },
      include: { tags: true },
    });
    
    return json(email);
  } else if (type === "delete") {
    const deleteId = parseInt(data.get("emailId") as string);

    // first delete its tag relation
    await prisma.tagsOnEmails.deleteMany({ where: { emailId: deleteId } });
    // then delete the email
    await prisma.email.delete({ where: { id: deleteId } });
    
    return json({ success: true });
  }

  return json({ success: false });
};