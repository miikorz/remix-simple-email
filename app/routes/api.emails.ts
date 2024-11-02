/* eslint-disable no-case-declarations */
import { prisma } from "~/db.server";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";

// Load all emails, optionally filter by tags or read status
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const tags = url.searchParams.get("tags");
  const read = url.searchParams.get("read");

  const emails = await prisma.email.findMany({
    where: {
      ...(tags ? { tags: { some: { tag: { name: { in: tags.split(",") } } } } } : {}),
      ...(read !== null ? { read: read === "true" } : {}),
    },
    include: { tags: true },
  });

  return json(emails);
};

// Action to handle creating, updating, or deleting emails, best scenario probably would be
// to split these into separate functions/endpoints
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const type = data.get("type");
  const read = data.get("read");

 if (type === "update read") {
    const id = parseInt(data.get("id") as string);
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
    const deleteId = parseInt(data.get("id") as string);

    await prisma.email.delete({ where: { id: deleteId } });

    // return updated list of emails
    const emails = await prisma.email.findMany({
      where: {
        ...(read !== null ? { read: read === "true" } : {}),
      },
      include: { tags: true },
    });
    
    return json(emails);
  }

  return json({ success: false });
};