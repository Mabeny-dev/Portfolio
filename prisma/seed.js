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

  // const existingAboutContent = await prisma.aboutContent.findFirst({
  //   select: { id: true },
  // });

  // // Seed the About page once with nested sections that match the admin form.
  // if (!existingAboutContent) {
  //   await prisma.aboutContent.create({
  //     data: {
  //       bio: `I'm John Mabeny, a fullstack developer who turns ideas into reliable, production-ready software. I specialize in React, Node.js, and PostgreSQL, with a focus on clean architecture, intuitive design, and performance. Whether it's a customer-facing product, an internal tool, or an API powering millions of requests, I care about thoughtful implementation and maintainable systems.`,
  //       skills: {
  //         create: [
  //           {
  //             category: "Frontend",
  //             items: [
  //               "HTML / CSS",
  //               "React",
  //               "Next.js",
  //               "TypeScript",
  //               "Tailwind CSS",
  //             ],
  //           },
  //           {
  //             category: "Backend",
  //             items: ["Node.js", "Express", "REST APIs", "Authentication"],
  //           },
  //           {
  //             category: "Database",
  //             items: ["PostgreSQL", "Prisma", "Database Design"],
  //           },
  //         ],
  //       },
  //       experiences: {
  //         create: [
  //           {
  //             role: "Fullstack Developer",
  //             company: "Freelance",
  //             period: "2023 - Present",
  //             description:
  //               "Building web applications for clients across various industries.",
  //           },
  //           {
  //             role: "Frontend Developer",
  //             company: "Tech Startup",
  //             period: "2022 - 2023",
  //             description:
  //               "Developed and maintained React-based dashboards and customer-facing apps.",
  //           },
  //         ],
  //       },
  //       educations: {
  //         create: [
  //           {
  //             degree: "B.Sc. Computer Science",
  //             school: "University of Dodoma",
  //             year: "2022",
  //           },
  //         ],
  //       },
  //       achievements: {
  //         create: [
  //           {
  //             issuer: "Open Source Contributor",
  //             year: "2023",
  //           },
  //           {
  //             issuer: "GitHub",
  //             year: "2023",
  //           },
  //         ],
  //       },
  //       languages: {
  //         create: [
  //           {
  //             name: "English",
  //             proficiency: "Native",
  //           },
  //           {
  //             name: "Swahili",
  //             proficiency: "Native",
  //           },
  //           {
  //             name: "French",
  //             proficiency: "Conversational",
  //           },
  //         ],
  //       },
  //     },
  //   });
  // }

  //   const projects = [
  //     {
  //       title: "E-commerce Dashboard",
  //       description:
  //         "A full-stack dashboard for managing online sales and inventory built with Next.js and Prisma.",
  //       year: "2024",
  //       status: "PUBLISHED",
  //       isVisible: true,
  //       tags: ["React", "Node.js", "Prisma"],
  //       githubUrl: "https://github.com",
  //       liveUrl: "https://shop-dashboard.vercel.app",
  //     },
  //     {
  //       title: "Weather Tracker Pro",
  //       description:
  //         "A real-time weather application using the OpenWeather API to provide detailed forecasts.",
  //       year: "2023",
  //       status: "PUBLISHED",
  //       isVisible: true,
  //       tags: ["JavaScript", "API", "CSS"],
  //       githubUrl: "https://github.com",
  //       liveUrl: "https://weather-pro.vercel.app",
  //     },
  //     {
  //       title: "AI Image Generator",
  //       description:
  //         "An interface for generating images from text prompts using OpenAI's DALL-E model.",
  //       year: "2024",
  //       status: "DRAFT",
  //       isVisible: false,
  //       tags: ["AI", "Next.js", "Tailwind"],
  //       githubUrl: "https://github.com",
  //       liveUrl: null,
  //     },
  //   ];

  //   // Use createMany to insert all at once
  //   await prisma.project.createMany({
  //     data: projects,
  //   });

  //   console.log("Seeding finished.");

  const products = [
    {
      name: "Officera",
      tagline: "NGO data collection, simplified.",
      description:
        "A field-friendly platform that helps NGOs collect, organize, and aggregate data with confidence. Built for low-bandwidth environments with offline sync capabilities.",
      year: 2026,
      status: "Published",
      tags: ["React", "Express", "Prisma", "PostgreSQL", "Offline-Sync"],
      liveUrl: "https://example.com",
      image: "https://unsplash.com",
    },
    {
      name: "FinFlow",
      tagline: "Automated treasury for startups.",
      description:
        "An AI-powered cashflow forecasting engine. Connects seamlessly to banking APIs to predict runway, categorize operational expenses, and generate investor-ready reports.",
      year: 2025,
      status: "Published",
      tags: ["Next.js", "FastAPI", "Python", "Tailwind", "AI"],
      liveUrl: "https://example.com",
      image: "https://unsplash.com",
    },
    {
      name: "EcoTrack API",
      tagline: "Carbon footprint accounting ledger.",
      description:
        "A robust developer API built to track enterprise logistical carbon footprints. Includes certified calculation webhooks for global freight operations.",
      year: 2026,
      status: "Draft",
      tags: ["Node.js", "TypeScript", "GraphQL", "AWS"],
      liveUrl: "https://example.com",
      image: null,
    },
  ];

  for (const product of products) {
    const created = await prisma.product;
    console.log(`✅ Created product: ${created.name}`);
  }

  console.log("🏁 Seeding finished successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
