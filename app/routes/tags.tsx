import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import TagManager from "~/components/TagManager";

interface Tag {
  id: string;
  name: string;
}
// TODO: Loader function to get individual email data (mock data for now)
export const loader: LoaderFunction = async () => {
  const tags = [{ id: 1, name: "work" }, { id: 1, name: "office" }]
  
  return json(tags);
};


export default function EmailDetailPage() {
  const tags: Tag[] = useLoaderData();

  return (
    <>
      <TagManager selectedTags={tags} onTagSelect={() => {}} />
    </>
  );
}