import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EmailDetail from "~/components/EmailDetail.component";
import { prisma } from "~/db.server";
import { Email } from "~/interfaces/Email";

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
      <EmailDetail emailData={email} />
    </>
  );
}