import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "@remix-run/react";
import { Tag } from "./TagManager";

// TODO: Move this to a shared file
export interface Email {
  id: number;
  subject: string;
  body: string;
  read: boolean;
  tags: { tagId: number, emailId: number }[];
}

export default function EmailList() {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [emails, setEmails] = useState<Email[]>([]);
  const [tags, setTags] = useState<Tag[]>([])

  // TODO: move to a custom hook?
  useEffect(() => {
    async function fetchTags() {
      const response = await fetch("/api/tags");
      const tags = await response.json();

      setTags(tags);
    }

    async function fetchEmails() {
      const response = await fetch("/api/emails");
      const emails = await response.json();

      const filteredEmails: Email[] = emails?.filter((email: Email) => {
      if (filter === "all") return true;
  
      return filter === "read" ? email.read : !email.read;
    });

      setEmails(filteredEmails);
    }

    fetchTags();
    fetchEmails();
  }, [filter]);

  const handleOnDeleteEmail = async (e: React.MouseEvent, email: Email) => {
    e.preventDefault();

    const response = await fetch(`/api/emails`, {
      method: "POST",
      body: new URLSearchParams({
        type: "delete",
        id: email.id.toString(),
        read: (email.read).toString(),
      }),
    })
    
    const updatedEmails = await response.json();

    setEmails(updatedEmails)
  }

  const getTag = (id: number): string => {
    const tag = tags.find((tag) => tag.id === id) || {id: "", name: "unexpected tag"};

    return tag.name;
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "read" ? "default" : "outline"} onClick={() => setFilter("read")}>
          Read
        </Button>
        <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>
          Unread
        </Button>
      </div>

      {emails.map((email) => (
        <Link to={`/email/${email.id}`} key={email.id}>
        <Card key={email.id} className="shadow-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-end">
              <Badge key={email.id} className="w-4 justify-center" onClick={(e) => handleOnDeleteEmail(e, email)}>
                ❌
              </Badge>
            </div>
            <div className="flex justify-between">
              <h3 className="font-semibold">{email.subject}</h3>
              <Badge variant={email.read ? "default" : "secondary"}>
                {email.read ? "Read" : "Unread"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex-col">
              {email.body.slice(0, 100)}...
              <div className="mt-4 flex gap-2 flex-wrap">
                {email.tags.map((tag) => (
                  <Badge
                  key={tag.tagId}
                  variant={"default"}
                  >
                    {getTag(tag.tagId)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      ))}
    </div>
  );
}