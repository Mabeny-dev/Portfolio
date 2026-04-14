import prisma from "../../../prisma/prisma.client.js";

const getAboutPublic = async (req, res) => {
  try {
    // The public site reads a single About page document with all of its
    // nested sections, so we return the oldest record as the canonical one.
    const aboutContent = await prisma.aboutContent.findFirst({
      include: {
        skills: true,
        experiences: true,
        educations: true,
        achievements: true,
        languages: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!aboutContent) {
      return res.status(404).json({ message: "About content not found" });
    }

    return res.status(200).json(aboutContent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getAboutPublic };
