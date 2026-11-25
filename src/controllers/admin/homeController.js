import { randomUUID } from "node:crypto";
import prisma from "../../../prisma/prisma.client.js";

const defaultAudienceItems = [
  {
    id: "ngos-nonprofits",
    title: "NGOs and Nonprofits",
    description: "Beneficiary management, data collection, reporting, internal workflows, and organizational websites.",
    icon: "HeartHandshake",
  },
  {
    id: "businesses-entrepreneurs",
    title: "Businesses and Entrepreneurs",
    description: "Business systems, websites, marketplaces, customer management, and process automation.",
    icon: "BriefcaseBusiness",
  },
  {
    id: "churches-faith-organizations",
    title: "Churches and Faith Organizations",
    description: "Member records, communication, donations, events, administration, and public websites.",
    icon: "Church",
  },
  {
    id: "schools-educational-institutions",
    title: "Schools and Educational Institutions",
    description: "Student records, registration, attendance, reporting, administration, and learning platforms.",
    icon: "GraduationCap",
  },
  {
    id: "hospitals-healthcare-organizations",
    title: "Hospitals and Healthcare Organizations",
    description: "Patient administration, appointments, internal records, reporting, staff workflows, and public information platforms.",
    icon: "HeartPulse",
  },
  {
    id: "public-sector-institutions",
    title: "Public-Sector Institutions",
    description: "Digital records, public-service portals, reporting systems, internal tools, and process automation.",
    icon: "Landmark",
  },
];

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
  audienceEyebrow: "Who I serve",
  audienceTitle: "Who I Build For",
  audienceIntro:
    "I build practical, dependable technology for organizations that want to improve their operations, manage information clearly, and serve people more effectively.",
  audienceItems: defaultAudienceItems,
  audienceCtaTitle: "Don’t see your organization listed?",
  audienceCtaBody:
    "If you have an operational problem that technology could simplify, let’s discuss it.",
  audienceCtaLabel: "Discuss your needs",
  // Legacy fields still exist as required columns in the production table.
  // They are no longer rendered, but must receive values on the first save.
  proofEyebrow: "Selected work",
  proofTitle: "Products built for real needs.",
  proofItems: [],
};

const getHomeContent = async (req, res) => {
  try {
    const home = await prisma.homeContent.findUnique({ where: { uniqueKey: "home" } });
    const content = home
      ? {
          ...defaults,
          ...home,
          audienceItems:
            Array.isArray(home.audienceItems) && home.audienceItems.length > 0
              ? home.audienceItems
              : defaults.audienceItems,
        }
      : defaults;
    return res.status(200).json({ home: content });
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

  const audienceFields = [
    "audienceEyebrow",
    "audienceTitle",
    "audienceIntro",
    "audienceCtaTitle",
    "audienceCtaBody",
    "audienceCtaLabel",
  ];
  const hasAudiencePayload = audienceFields.some((field) => field in req.body) || "audienceItems" in req.body;

  if (hasAudiencePayload) {
    if (audienceFields.some((field) => !String(req.body[field] ?? "").trim())) {
      return res.status(400).json({ message: "All audience section fields are required" });
    }
    if (!Array.isArray(req.body.audienceItems) || req.body.audienceItems.length === 0 || req.body.audienceItems.length > 12) {
      return res.status(400).json({ message: "Add between 1 and 12 audience groups" });
    }

    const audienceItems = req.body.audienceItems.map((item) => ({
      id: String(item?.id || randomUUID()).trim(),
      title: String(item?.title ?? "").trim(),
      description: String(item?.description ?? "").trim(),
      icon: String(item?.icon ?? "Users").trim(),
    }));

    if (audienceItems.some((item) => !item.title || !item.description || !item.icon)) {
      return res.status(400).json({ message: "Every audience group needs a title, description, and icon" });
    }

    Object.assign(
      data,
      Object.fromEntries(audienceFields.map((field) => [field, String(req.body[field]).trim()])),
      { audienceItems },
    );
  }

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
        audienceEyebrow: defaults.audienceEyebrow,
        audienceTitle: defaults.audienceTitle,
        audienceIntro: defaults.audienceIntro,
        audienceItems: defaults.audienceItems,
        audienceCtaTitle: defaults.audienceCtaTitle,
        audienceCtaBody: defaults.audienceCtaBody,
        audienceCtaLabel: defaults.audienceCtaLabel,
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
