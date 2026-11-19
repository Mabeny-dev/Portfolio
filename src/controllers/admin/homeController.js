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
  proofEyebrow: "Beyond the portfolio",
  proofTitle: "Real products, built from first idea to production.",
  proofItems: [
    { value: "02", label: "Production platforms", description: "Junuby and Officera, designed, developed, and deployed.", visible: true },
    { value: "06+", label: "Organization types", description: "Built for NGOs, schools, churches, businesses, associations, and teams.", visible: true },
    { value: "End-to-end", label: "Product development", description: "Frontend, backend, databases, infrastructure, deployment, and maintenance.", visible: true },
    { value: "Africa-first", label: "Product thinking", description: "Practical software shaped around regional organizational needs.", visible: true },
  ],
};

const normalizeProofItems = (items) => {
  if (!Array.isArray(items)) return null;
  return items.map((item) => ({
    value: String(item?.value ?? "").trim(),
    label: String(item?.label ?? "").trim(),
    description: String(item?.description ?? "").trim(),
    visible: item?.visible !== false,
  }));
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
  const proofItems = normalizeProofItems(req.body.proofItems);
  const required = [
    "missionEyebrow",
    "missionTitle",
    "missionParagraphOne",
    "missionParagraphTwo",
    "officeraUrl",
    "junubyUrl",
    "proofEyebrow",
    "proofTitle",
  ];

  if (required.some((field) => !String(req.body[field] ?? "").trim()) || !proofItems?.length) {
    return res.status(400).json({ message: "All homepage fields and at least one proof item are required" });
  }

  if (proofItems.some((item) => !item.value || !item.label || !item.description)) {
    return res.status(400).json({ message: "Every proof item needs a value, label, and description" });
  }

  const data = Object.fromEntries(required.map((field) => [field, String(req.body[field]).trim()]));

  try {
    const home = await prisma.homeContent.upsert({
      where: { uniqueKey: "home" },
      update: { ...data, proofItems },
      create: { ...data, proofItems, uniqueKey: "home" },
    });
    return res.status(200).json({ home });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { defaults as defaultHomeContent, getHomeContent, updateHomeContent };
