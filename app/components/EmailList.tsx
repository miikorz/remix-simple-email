import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "@remix-run/react";

// TODO: Move this to a shared file
export interface Email {
  id: number;
  subject: string;
  body: string;
  read: boolean;
}

interface EmailListProps {
  emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const filteredEmails = emails?.filter((email) => {
    if (filter === "all") return true;
    return filter === "read" ? email.read : !email.read;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
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

      {filteredEmails.map((email) => (
        <Link to={`/email/${email.id}`} key={email.id}>
        <Card key={email.id} className="shadow-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between">
            <h3 className="font-semibold">{email.subject}</h3>
            <Badge variant={email.read ? "default" : "secondary"}>
              {email.read ? "Read" : "Unread"}
            </Badge>
          </CardHeader>
          <CardContent>{email.body.slice(0, 100)}...</CardContent>
        </Card>
        </Link>
      ))}
    </div>
  );
}