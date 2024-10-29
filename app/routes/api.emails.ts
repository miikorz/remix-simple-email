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
      ...(tags ? { tags: { some: { name: { in: tags.split(",") } } } } : {}),
      ...(read !== null ? { read: read === "true" } : {}),
    },
    include: { tags: true },
  });

  return json(emails);
};

// Action to handle creating, updating, or deleting emails
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const type = data.get("type");

  switch (type) {
    case "create":
      const subject = data.get("subject") as string;
      const body = data.get("body") as string;
      await prisma.email.create({ data: { subject, body } });
      break;
    case "update":
      const id = parseInt(data.get("id") as string);
      const read = data.get("read") === "true";
      await prisma.email.update({ where: { id }, data: { read } });
      break;
    case "delete":
      const deleteId = parseInt(data.get("id") as string);
      await prisma.email.delete({ where: { id: deleteId } });
      break;
  }

  return json({ success: true });
};