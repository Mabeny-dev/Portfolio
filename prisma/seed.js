import prisma from "./prisma.client.js";

async function main() {
  // const heroContent = await prisma.heroContent.upsert({
  //   where: { uniqueKey: "hero" },
  //   update: {},
  //   create: {
  //     badge: "Fullstack Developer",
  //     firstName: "John",
  //     secondName: "Mabeny",
  //     phrases: [
  //       "performant APIs.",
  //       "clean React apps.",
  //       "scalable backends.",
  //       "minimal interfaces.",
  //     ],
  //     subtitle:
  //       "With React, Node.js, and PostgreSQL — clean code and minimal design.",
  //     uniqueKey: "hero",
  //   },
  // });

  const projects = [
    {
      title: "E-commerce Dashboard",
      description:
        "A full-stack dashboard for managing online sales and inventory built with Next.js and Prisma.",
      year: "2024",
      status: "PUBLISHED",
      isVisible: true,
      tags: ["React", "Node.js", "Prisma"],
      githubUrl: "https://github.com",
      liveUrl: "https://shop-dashboard.vercel.app",
    },
    {
      title: "Weather Tracker Pro",
      description:
        "A real-time weather application using the OpenWeather API to provide detailed forecasts.",
      year: "2023",
      status: "PUBLISHED",
      isVisible: true,
      tags: ["JavaScript", "API", "CSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://weather-pro.vercel.app",
    },
    {
      title: "AI Image Generator",
      description:
        "An interface for generating images from text prompts using OpenAI's DALL-E model.",
      year: "2024",
      status: "DRAFT",
      isVisible: false,
      tags: ["AI", "Next.js", "Tailwind"],
      githubUrl: "https://github.com",
      liveUrl: null,
    },
  ];

  // Use createMany to insert all at once
  await prisma.project.createMany({
    data: projects,
  });

  console.log("Seeding finished.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
