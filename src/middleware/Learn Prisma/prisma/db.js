import prisma from "./prisma.client.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via Prisma");
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};
const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { connectDB, disconnectDB };
