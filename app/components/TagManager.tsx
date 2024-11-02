import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// TODO Move this to a shared file
export interface Tag {
  id: number;
  name: string;
}

interface TagManagerProps {
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
}

export default function TagManager({ selectedTags, onTagSelect }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [alreadyExistsError, setAlreadyExistsError] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    async function fetchTags() {
      const response = await fetch("/api/tags");
      const tags = await response.json();
      setTags(tags);
    }

    fetchTags();
  }, []);

  const handleAddTag = async () => {
    setAlreadyExistsError(false);

    if (!newTag) return;

    if (tags.some((tag) => tag.name.toLowerCase() === newTag.toLowerCase())) {
      setAlreadyExistsError(true);
      return;
    }

    const response = await fetch("/api/tags", {
      method: "POST",
      body: new URLSearchParams({ name: newTag, type: "create" }),
    });

    const createdTag = await response.json();
    setTags((prevTags) => [...prevTags, createdTag]);
    setNewTag("");
  };

  const handleDeleteTag = async (tag: Tag) => {
    await fetch(`/api/tags`, {
      method: "POST",
      body: new URLSearchParams({ id: tag.id.toString(), type: "delete" }),
    });

    setTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <Button onClick={handleAddTag}>Add Tag</Button>
      </div>
      {alreadyExistsError && (
        <p className="text-red-500">Tag already exists</p>
      )}
      <div className="mt-4 flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.some((t) => t.id === tag.id) ? "default" : "secondary"}
            onClick={() => onTagSelect(tag)}
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
