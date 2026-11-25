import { randomUUID } from "node:crypto";
import prisma from "../../../prisma/prisma.client.js";

const defaults = {
  uniqueKey: "home",
  missionEyebrow: "Engineer and founder",
  missionTitle: "Building software for institutions that matter.",
  missionParagraphOne:
    "I’m John Mabeny, a South Sudanese software engineer and founder of Banjo Systems LLC—a technology company I’m building to create dependable digital systems for NGOs, businesses, churches, and public-sector institutions across Africa.",
  missionParagraphTwo:
    "Through Banjo Systems, I develop products such as Officera and Junuby—taking them from early ideas through design, engineering, deployment, and long-term operation.",
  officeraUrl: "https://officera.app",
  junubyUrl: "https://junuby.com",
  // Legacy fields still exist as required columns in the production table.
  // They are no longer rendered, but must receive values on the first save.
  proofEyebrow: "Selected work",
  proofTitle: "Products built for real needs.",
  proofItems: [],
};

const getHomeContent = async (req, res) => {
  try {
    const home = await prisma.homeContent.findUnique({ where: { uniqueKey: "home" } });
    return res.status(200).json({ home: home ?? defaults });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateHomeContent = async (req, res) => {
  const required = [
    "missionEyebrow",
    "missionTitle",
    "missionParagraphOne",
    "missionParagraphTwo",
    "officeraUrl",
    "junubyUrl",
  ];

  if (required.some((field) => !String(req.body[field] ?? "").trim())) {
    return res.status(400).json({ message: "All homepage mission fields are required" });
  }

  const data = Object.fromEntries(required.map((field) => [field, String(req.body[field]).trim()]));

  try {
    const home = await prisma.homeContent.upsert({
      where: { uniqueKey: "home" },
      update: data,
      // HomeContent.id is required in PostgreSQL and its original migration
      // has no database-level default. Supplying it explicitly keeps the
      // first save reliable when Prisma takes the upsert create branch.
      create: {
        id: randomUUID(),
        ...data,
        uniqueKey: "home",
        proofEyebrow: defaults.proofEyebrow,
        proofTitle: defaults.proofTitle,
        proofItems: defaults.proofItems,
      },
    });
    return res.status(200).json({ home });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { defaults as defaultHomeContent, getHomeContent, updateHomeContent };
