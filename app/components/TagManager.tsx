import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
}

export default function TagManager({ selectedTags, onTagSelect }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
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
    if (!newTag) return;

    const response = await fetch("/api/tags", {
      method: "POST",
      body: new URLSearchParams({ name: newTag }),
    });

    const createdTag = await response.json();
    setTags((prevTags) => [...prevTags, createdTag]);
    setNewTag("");
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <Button onClick={handleAddTag}>Add Tag</Button>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.some((t) => t.id === tag.id) ? "default" : "secondary"}
            onClick={() => onTagSelect(tag)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
