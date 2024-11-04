import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "@remix-run/react";
import { Tag } from "~/interfaces/Tag";
import { useTag } from "~/customHooks/useTag";

export default function TagManager() {
  const { tags, createNewTag, deleteTag, error, setNewTag, newTag } = useTag();

  const handleAddTag = async () => {
    await createNewTag();
  };

  const handleDeleteTag = async (tag: Tag) => {
    await deleteTag(tag);
  }

  return (
    <>
      <Link to="/">
        <Button className="mb-2 mt-2" variant={"secondary"}>
          ↩️ Back to Email List
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <Button onClick={handleAddTag}>Add Tag</Button>
      </div>
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      <div className="mt-4 flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={tags.some((t) => t.id === tag.id) ? "default" : "secondary"}
          >
            {tag.name}
                <Badge className="flex ml-2 justify-center size-4 align-middle cursor-pointer" variant={"secondary"} onClick={() => handleDeleteTag(tag)}>
                  ❌
                </Badge>
          </Badge>
        ))}
      </div>
    </>
  );
}
