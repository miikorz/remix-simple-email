import { prisma } from "~/db.server";

describe("Tag API", () => {
  afterEach(async () => {
    await prisma.tag.deleteMany(); // Clean up tags after each test
  });

  test("can create a new tag", async () => {
    const tag = await prisma.tag.create({ data: { name: "important" } });
    expect(tag).toHaveProperty("id");
    expect(tag.name).toBe("important");
  });

  test("can retrieve all tags", async () => {
    await prisma.tag.createMany({ data: [{ name: "work" }, { name: "personal" }] });
    const tags = await prisma.tag.findMany();
    expect(tags).toHaveLength(2);
  });
});
