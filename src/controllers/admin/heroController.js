import prisma from "../../../prisma/prisma.client.js";

const getHeroContent = async (req, res) => {
  try {
    const hero = await prisma.heroContent.findUnique({
      where: { uniqueKey: "hero" },
    });

    if (!hero) {
      return res.status(404).json({ error: "Hero content not found!" });
    }

    return res.status(200).json({ hero });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHeroContent = async (req, res) => {
  const { badge, firstName, secondName, phrases, subtitle } = req.body;

  if (!badge || !firstName || !secondName || !subtitle || !Array.isArray(phrases)) {
    return res.status(400).json({
      message: "badge, firstName, secondName, phrases, and subtitle are required",
    });
  }

  try {
    const hero = await prisma.heroContent.upsert({
      where: { uniqueKey: "hero" },
      update: { badge, firstName, secondName, phrases, subtitle },
      create: {
        badge,
        firstName,
        secondName,
        phrases,
        subtitle,
        uniqueKey: "hero",
      },
    });

    return res.json(hero);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getHeroContent, updateHeroContent };
