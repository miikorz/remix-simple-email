import { render, screen, fireEvent } from "@testing-library/react";
import EmailDetail from "~/components/EmailDetail";

const email = {
  id: 1,
  subject: "First Email",
  body: "Hello",
  read: false,
  tags: [{ id: 1, name: "work" }],
};

test("renders email detail", () => {
  render(<EmailDetail email={email} />);
  expect(screen.getByText(/First Email/i)).toBeInTheDocument();
  expect(screen.getByText(/Hello/i)).toBeInTheDocument();
});

test("toggles read/unread status", () => {
  render(<EmailDetail email={email} />);
  const toggleButton = screen.getByText("Mark as Read");
  fireEvent.click(toggleButton);
  expect(screen.getByText("Mark as Unread")).toBeInTheDocument();
});

test("selects and deselects tags", async () => {
  render(<EmailDetail email={email} />);

  const tagButton = screen.getByText("work");
  fireEvent.click(tagButton); // Toggle tag
  expect(tagButton).toHaveStyle("background-color: lightgreen"); // Selected

  fireEvent.click(tagButton); // Toggle tag off
  expect(tagButton).toHaveStyle("background-color: white"); // Deselected
});
