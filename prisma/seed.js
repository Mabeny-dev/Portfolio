const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function main() {
  // ─── Admin User ───
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: randomUUID(),
      email: "admin@example.com",
      name: "John Mabeny",
      password: "$2b$10$PLACEHOLDER_HASH", // Replace with a real bcrypt hash
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // ─── Hero Content ───
  await prisma.heroContent.create({
    data: {
      badge: "Fullstack Developer",
      name: "John",
      highlight: "Mabeny",
      phrases: [
        "performant APIs.",
        "clean React apps.",
        "scalable backends.",
        "minimal interfaces.",
      ],
      subtitle:
        "With React, Node.js, and PostgreSQL — clean code, minimal design.",
    },
  });

  console.log("✅ Hero content seeded");

  // ─── Testimonials ───
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Sarah Kimani",
        role: "Product Manager, Finova",
        text: "John delivered a complex dashboard ahead of schedule. His attention to detail and clean code made our review process painless.",
        authorId: admin.id,
      },
      {
        name: "David Ochieng",
        role: "CTO, Mwanga Labs",
        text: "Working with John felt effortless. He turned a rough wireframe into a polished, performant app that our users love.",
        authorId: admin.id,
      },
      {
        name: "Amina Yusuf",
        role: "Founder, EduBridge",
        text: "Reliable, communicative, and genuinely skilled. John rebuilt our backend and reduced page load times by 60%.",
        authorId: admin.id,
      },
    ],
  });

  console.log("✅ Testimonials seeded");

  // ─── Projects ───
  await prisma.project.createMany({
    data: [
      {
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce solution with real-time inventory, Stripe payments, and admin dashboard.",
        tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
        year: "2025",
        status: "PUBLISHED",
        authorId: admin.id,
      },
      {
        title: "Task Management App",
        description:
          "Collaborative project management tool with real-time updates and role-based access.",
        tags: ["React", "Node.js", "Socket.io", "PostgreSQL"],
        year: "2024",
        status: "PUBLISHED",
        authorId: admin.id,
      },
      {
        title: "Blog CMS",
        description:
          "Headless CMS with markdown support, image optimization, and SEO tools built from scratch.",
        tags: ["Next.js", "Express", "Prisma", "AWS S3"],
        year: "2024",
        status: "DRAFT",
        authorId: admin.id,
      },
      {
        title: "Analytics Dashboard",
        description:
          "Real-time data visualization dashboard with customizable widgets and export functionality.",
        tags: ["React", "D3.js", "Node.js", "PostgreSQL"],
        year: "2023",
        status: "PUBLISHED",
        authorId: admin.id,
      },
    ],
  });

  console.log("✅ Projects seeded");

  // ─── Articles ───
  await prisma.article.createMany({
    data: [
      {
        title: "Building Scalable APIs with Express and Prisma",
        content: "",
        tag: "Backend",
        status: "PUBLISHED",
        authorId: admin.id,
      },
      {
        title: "React Server Components: A Practical Guide",
        content: "",
        tag: "Frontend",
        status: "PUBLISHED",
        authorId: admin.id,
      },
      {
        title: "PostgreSQL Indexing Strategies for Web Apps",
        content: "",
        tag: "Database",
        status: "DRAFT",
        authorId: admin.id,
      },
      {
        title: "Clean Code Principles in TypeScript",
        content: "",
        tag: "General",
        status: "PUBLISHED",
        authorId: admin.id,
      },
    ],
  });

  console.log("✅ Articles seeded");

  // ─── About Content ───
  const about = await prisma.aboutContent.create({
    data: {
      bio: "I'm John Mabeny — a fullstack JavaScript developer passionate about building clean, functional, and user-centered web applications. I specialize in React, Node.js, and PostgreSQL.",
    },
  });

  await prisma.skill.createMany({
    data: [
      { category: "Frontend", items: ["HTML / CSS", "React", "Next.js", "TypeScript", "Tailwind CSS"], aboutContentId: about.id },
      { category: "Backend", items: ["Node.js", "Express", "REST APIs", "Authentication"], aboutContentId: about.id },
      { category: "Database", items: ["PostgreSQL", "Prisma ORM", "Database Design"], aboutContentId: about.id },
      { category: "Tools", items: ["Git", "Docker", "VS Code", "Figma", "Linux"], aboutContentId: about.id },
    ],
  });

  await prisma.experience.createMany({
    data: [
      { role: "Fullstack Developer", company: "Freelance", period: "2023 – Present", description: "Building web applications for clients across various industries.", aboutContentId: about.id },
      { role: "Frontend Developer", company: "Tech Startup", period: "2022 – 2023", description: "Developed and maintained React-based dashboards and customer-facing apps.", aboutContentId: about.id },
    ],
  });

  await prisma.education.create({
    data: { degree: "B.Sc. Computer Science", school: "University of Technology", year: "2020 – 2024", aboutContentId: about.id },
  });

  await prisma.achievement.createMany({
    data: [
      { title: "Best Developer Award", issuer: "Tech Community Kenya", year: "2024", aboutContentId: about.id },
      { title: "Open Source Contributor", issuer: "GitHub", year: "2023", aboutContentId: about.id },
    ],
  });

  await prisma.language.createMany({
    data: [
      { name: "English", proficiency: "Native", aboutContentId: about.id },
      { name: "Swahili", proficiency: "Native", aboutContentId: about.id },
      { name: "French", proficiency: "Conversational", aboutContentId: about.id },
    ],
  });

  console.log("✅ About content seeded");

  // ─── Sample Contact Messages ───
  await prisma.contactMessage.createMany({
    data: [
      { name: "Jane Doe", email: "jane@example.com", message: "Hi John, I'd love to discuss a freelance project with you!", read: false },
      { name: "Mark Wilson", email: "mark@company.co", message: "Great portfolio! Are you available for a 3-month contract?", read: false },
    ],
  });

  console.log("✅ Contact messages seeded");
  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
