import { prisma } from "~/db.server";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";

// Get all tags
export const loader: LoaderFunction = async () => {
  const tags = await prisma.tag.findMany();
  return json(tags);
};

// Create a new tag
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name") as string;
  const type = data.get("type");

  if (type === "create" && !name) {
    throw new Response("Tag name is required", { status: 400 });
  }

  const tag = await prisma.tag.create({ data: { name } });
  return json(tag);
};
