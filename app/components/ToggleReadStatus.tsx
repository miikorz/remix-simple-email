
import { Button } from "./ui/button";

interface ToggleReadStatusProps {
    emailId: number;
    isRead: boolean;
    onToggle: (isRead: boolean) => void;
}

export default function ToggleReadStatus({ emailId, isRead, onToggle }: ToggleReadStatusProps) {
  const toggleReadStatus = async () => {
    await fetch(`/api/emails`, {
      method: "POST",
      body: new URLSearchParams({
        type: "update read",
        id: emailId.toString(),
        read: (!isRead).toString(),
      }),
    });
    onToggle(!isRead);
  };

  return (
    <Button variant={"default"} onClick={toggleReadStatus}>
      {isRead ? "Mark as Unread" : "Mark as Read"}
    </Button>
  );
}
