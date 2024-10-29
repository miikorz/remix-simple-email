import { render, screen, fireEvent } from "@testing-library/react";
import ToggleReadStatus from "~/components/ToggleReadStatus";

test("ToggleReadStatus toggles between read and unread", async () => {
  const mockToggle = jest.fn();
  render(<ToggleReadStatus emailId={1} isRead={false} onToggle={mockToggle} />);

  const button = screen.getByText("Mark as Read");
  fireEvent.click(button);

  expect(mockToggle).toHaveBeenCalledWith(true);
});
