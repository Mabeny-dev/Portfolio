import prisma from "./prisma.client.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected via prisma");
  } catch (error) {
    console.error("Database connection Error: ", error);
    throw error;
  }
};
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.log("Database disconnection error: ", error);
  }
};

export { connectDB, disconnectDB };
