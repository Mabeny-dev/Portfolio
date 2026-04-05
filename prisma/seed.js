import prisma from "./prisma.client.js";

async function main() {
  const heroContent = await prisma.heroContent.upsert({
    where: { uniqueKey: "hero" },
    update: {},
    create: {
      badge: "Fullstack Developer",
      firstName: "John",
      secondName: "Mabeny",
      phrases: [
        "performant APIs.",
        "clean React apps.",
        "scalable backends.",
        "minimal interfaces.",
      ],
      subtitle:
        "With React, Node.js, and PostgreSQL — clean code and minimal design.",
      uniqueKey: "hero",
    },
  });

  console.log({ heroContent });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
