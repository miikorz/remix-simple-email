
import { Button } from "./ui/button";

interface ToggleReadStatusProps {
  isRead: boolean;
  onClick: () => void;
}

export default function ToggleReadStatus({ isRead, onClick: toggleReadStatus }: ToggleReadStatusProps) {
  const handleOnClickReadStatus = async () => {
    await toggleReadStatus();
  };

  return (
    <Button variant={"default"} onClick={handleOnClickReadStatus}>
      {isRead ? "Mark as Unread" : "Mark as Read"}
    </Button>
  );
}
