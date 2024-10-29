import ToggleReadStatus from "./ToggleReadStatus";
import TagManager from "./TagManager";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "@remix-run/react";

// MOVE EMAIL/TAGS INTERFACE TO A SHARED FILE
interface EmailDetailProps {
    email: Email
}

export interface Email {
    id: number;
    subject: string;
    body: string;
    read: boolean;
    tags?: Tag[];
}

interface Tag {
    id: string;
    name: string;
}

export default function EmailDetail({ email }: EmailDetailProps) {
  const [isRead, setIsRead] = useState(email.read);
  const [tags, setTags] = useState(email.tags || []);


const handleTagSelect = (tag: Tag) => {
    setTags((prevTags) =>
        prevTags.some((t) => t.id === tag.id)
            ? prevTags.filter((t) => t.id !== tag.id)
            : [...prevTags, tag]
    );
};

  return (
    <>
    <Link to="/">Back to Email List</Link>
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{email.subject}</h2>
        <Badge variant={isRead ? "default" : "secondary"}>{isRead ? "Read" : "Unread"}</Badge>
      </div>
      <CardContent className="mb-6">{email.body}</CardContent>

      <ToggleReadStatus emailId={email.id} isRead={isRead} onToggle={setIsRead} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Tags</h3>
        <TagManager selectedTags={tags} onTagSelect={handleTagSelect} />
      </div>
    </Card>
    </>
  );
}