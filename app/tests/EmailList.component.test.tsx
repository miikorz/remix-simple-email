import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";
import { createRemixStub } from "@remix-run/testing";
import EmailList from "~/components/EmailList.component";
import { json } from "@remix-run/node";
import { Email } from "~/interfaces/Email";

const email: Email = {
  id: 1,
  subject: "First Email",
  body: "Hello",
  read: false,
  tags: [{ tagId: 1, emailId: 1 }],
};

test.skip("renders email detail", () => {
    const RemixStub = createRemixStub([
    {
      path: "/",
      Component: EmailList,
      loader() {
        return json([email]);
      },
    },
  ]);

  render(<RemixStub />);

  console.log(screen);
  // const { getByText, container } = render(<EmailDetail emailData={email} />);
  // console.log(prettyDOM(container));

  // expect(getByText(/First Email/i)).toBeInTheDocument();
  // expect(getByText(/Hello/i)).toBeInTheDocument();
});

// test("toggles read/unread status", () => {
//   render(<EmailDetail email={email} />);
//   const toggleButton = screen.getByText("Mark as Read");
//   fireEvent.click(toggleButton);
//   expect(screen.getByText("Mark as Unread")).toBeInTheDocument();
// });

// test("selects and deselects tags", async () => {
//   render(<EmailDetail email={email} />);

//   const tagButton = screen.getByText("work");
//   fireEvent.click(tagButton); // Toggle tag
//   expect(tagButton).toHaveStyle("background-color: lightgreen"); // Selected

//   fireEvent.click(tagButton); // Toggle tag off
//   expect(tagButton).toHaveStyle("background-color: white"); // Deselected
// });
