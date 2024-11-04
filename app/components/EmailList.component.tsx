import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "@remix-run/react";
import { Email } from "~/interfaces/Email";
import { useTag } from "~/customHooks/useTag";
import { useEmails } from "~/customHooks/useEmails";

export default function EmailList() {
  const { getTag } = useTag();
  const { emails, filter, deleteEmail, setFilter: changeFilter} = useEmails();

  const handleOnDeleteEmail = async (e: React.MouseEvent, email: Email) => {
    e.preventDefault();
    
    await deleteEmail(email);
  }

  const handleOnChangeFilter = async (value: "all" | "read" | "unread") => {
    changeFilter(value);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex mb-2 mt-2 justify-between">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => handleOnChangeFilter("all")}>
            All
          </Button>
          <Button variant={filter === "read" ? "default" : "outline"} onClick={() => handleOnChangeFilter("read")}>
            Read
          </Button>
          <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => handleOnChangeFilter("unread")}>
            Unread
          </Button>
        </div>
        <Link to="/tags">
          <Button variant={"secondary"}>
            Tag Manager
          </Button>
        </Link>
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