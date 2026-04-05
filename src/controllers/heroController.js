import prisma from "../../prisma/prisma.client.js";

// Get hero content
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
  try {
    const hero = await prisma.heroContent.upsert({
      where: { uniqueKey: "hero" },
      update: { badge, firstName, secondName, subtitle },
      create: { badge, firstName, secondName, subtitle, uniqueKey: "hero" },
    });

    res.json(hero);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

export { getHeroContent, updateHeroContent };
