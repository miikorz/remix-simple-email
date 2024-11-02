import ToggleReadStatus from "./ToggleReadStatus";
import { Tag } from "./TagManager";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

// MOVE EMAIL/TAGS INTERFACE TO A SHARED FILE
interface EmailDetailProps {
    emailData: Email
}

export interface Email {
    id: number;
    subject: string;
    body: string;
    read: boolean;
    tags: { tagId: number, emailId: number }[];
}

export default function EmailDetail({ emailData }: EmailDetailProps) {
  const [isRead, setIsRead] = useState(emailData.read);
  const [tags, setTags] = useState<Tag[]>([]);
  const [email, setEmail] = useState<Email>(emailData);

  // TODO: move to a custom hook?
  useEffect(() => {
    async function fetchTags() {
      const response = await fetch("/api/tags");
      const tags = await response.json();

      setTags(tags);
    }

    fetchTags();
  }, []);

  const getTag = (id: number): string => {
    const tag: Tag = tags.find((tag) => tag.id === id) || {id: 0, name: "unexpected tag"};

    return tag.name;
  }


const handleTagSelect = async (tagId: string) => {
  const response = await fetch(`/api/emails`, {
    method: "POST",
    body: new URLSearchParams({
      type: "add tag",
      emailId: email.id.toString(),
      tagId,
      read: (email.read).toString(),
    }),
  });

      const updatedEmail = await response.json();

    setEmail(updatedEmail)
};

const handleDeleteTag = async (tagId: string) => {
 const response = await fetch(`/api/emails`, {
    method: "POST",
    body: new URLSearchParams({
      type: "delete tag",
      emailId: email.id.toString(),
      tagId,
      read: (email.read).toString(),
    }),  
  });

  const updatedEmail = await response.json();
  setEmail(updatedEmail)
}

  return (
    <>
    <Link to="/">
      <Button className="mb-2 mt-2" variant={"secondary"}>
        ↩️ Back to Email List
      </Button>
    </Link>
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{email.subject}</h2>
        <Badge variant={isRead ? "default" : "secondary"}>{isRead ? "Read" : "Unread"}</Badge>
      </div>
      <CardContent className="mb-6">{email.body}</CardContent>
      <div className="flex gap-4">
        <ToggleReadStatus emailId={email.id} isRead={isRead} onToggle={setIsRead} />
        <Select onValueChange={(value) => handleTagSelect(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add a new tag"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tags</SelectLabel>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>{tag.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {email.tags.map((tag) => (
          <Badge
          key={tag.tagId}
          variant={"default"}
          >
            {getTag(tag.tagId)}
            <Badge className="flex ml-2 justify-center size-4 align-middle cursor-pointer" variant={"secondary"} onClick={() => handleDeleteTag(tag.tagId.toString())}>
              ❌
            </Badge>
          </Badge>
        ))}
      </div>
    </Card>
    </>
  );
}