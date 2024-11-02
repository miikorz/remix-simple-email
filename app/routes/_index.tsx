// import { useLoaderData } from "@remix-run/react";
// import { LoaderFunction } from "@remix-run/node";
import EmailList from "~/components/EmailList";
// import { prisma } from "~/db.server";

// export const loader: LoaderFunction = async () => {
//   const emails = await prisma.email.findMany({ include: { tags: true } });
  
//   return emails;
// };

export default function Index() {
  // const emails: Email[] = useLoaderData();

  return (
    <>
      <EmailList />
    </>
  );
}