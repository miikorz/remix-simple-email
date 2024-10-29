import { prisma } from "~/db.server";

test("create email", async () => {
  const email = await prisma.email.create({
    data: { subject: "Test", body: "Testing...", read: false },
  });
  expect(email).toHaveProperty("id");
  await prisma.email.delete({ where: { id: email.id } }); // Cleanup
});