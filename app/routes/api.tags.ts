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

  if (type === "create") {
    if (!name) {
      throw new Response("Tag name is required", { status: 400 }); 
    }
    const tag = await prisma.tag.create({ data: { name } });

    return json(tag);
  } else if (type === "delete") {
    const id = data.get("id");
    
    if (typeof id === "string") {
      await prisma.tag.delete({ where: { id: parseInt(id, 10) } });
    } else {
      throw new Response("Tag ID is required and must be a string", { status: 400 });
    }

    return json({ success: true });
  }

};
