import prisma from "../prisma/prisma.client.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = "mabeny.johnson@gmail.com";
  const password = "Ebenezer@2026";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
