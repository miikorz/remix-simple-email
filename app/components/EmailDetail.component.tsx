import ToggleReadStatus from "./ToggleReadStatus.component";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { Email } from "~/interfaces/Email";
import { useEmail } from "~/customHooks/useEmail";
import { useTag } from "~/customHooks/useTag";

interface EmailDetailProps {
    emailData: Email
}

export default function EmailDetail({ emailData }: EmailDetailProps) {
  const { email, addTag, deleteTag, isRead, toggleReadStatus } = useEmail(emailData);
  const { tags, getTag } = useTag();

  const handleTagSelect = async (tagId: string) => {
    addTag(tagId);
  };

  const handleDeleteTag = async (tagId: string) => {
    deleteTag(tagId);
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
        <ToggleReadStatus isRead={isRead} onClick={toggleReadStatus} />
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