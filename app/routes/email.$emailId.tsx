import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EmailDetail, { Email } from "~/components/EmailDetail";
import { prisma } from "~/db.server";

// TODO: Loader function to get individual email data (mock data for now)
export const loader: LoaderFunction = async ({ params }) => {
  const { emailId } = params;
  const email = await prisma.email.findUnique({
    where: { id: Number(emailId) },
    include: { tags: true },
  });
  
  return json(email);
};

export default function EmailDetailPage() {
  const email: Email = useLoaderData();

  return (
    <>
      <EmailDetail email={email} />
    </>
  );
}